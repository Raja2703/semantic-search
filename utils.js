import { timeout } from './config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';

export const createPineconeIndex = async (client, indexName, vectorDimension) => {
	console.log(`checking ${indexName}...`);
	const existingIndexes = await client.listIndexes();
	// console.log(existingIndexes.indexes);

	let indexExists = false;

	for (const index of existingIndexes.indexes) {
		if (index.name === indexName) {
			indexExists = true;
			break;
		}
	}

	if (!indexExists) {
		console.log(`Creating ${indexName}...`);

		await client.createIndex({
			name: indexName,
			dimension: vectorDimension,
			metric: 'cosine',
			spec: {
				serverless: {
					cloud: 'aws',
					region: 'us-east-1',
				},
			},
		});

		await new Promise((resolve) => setTimeout(resolve, timeout));
	} else {
		console.log(`${indexName} already exists`);
	}
};

export const updatePinecone = async (client, indexName, docs) => {
	try {
		const index = await client.Index(indexName);

		console.log(`Pinecone index retrieved: ${indexName}`);

		for (const doc of docs) {
			const txtPath = doc.metadata.source;
			const text = doc.pageContent;

			const textSplitter = new RecursiveCharacterTextSplitter({
				chunkSize: 1000,
			});

			const chunks = await textSplitter.createDocuments([text]);
			const embeddingsArrays = await new OpenAIEmbeddings({ openAIApiKey: process.env.open_ai_api_key }).embedDocuments(chunks.map((chunk) => chunk.pageContent.replace(/\n/g, '')));

			let batch = [];
			const batchSize = 100;

			for (let idx = 0; idx < chunks.length; idx++) {
				const chunk = chunks[idx];
				const vector = {
					id: `${txtPath}_${idx}`,
					values: embeddingsArrays[idx],
					metadata: {
						...chunks.metadata,
						loc: JSON.stringify(chunk.metadata.loc),
						pageContent: chunk.pageContent,
						txtPath: txtPath,
					},
				};

				batch.push(vector);
				console.log('batch type: ', Array.isArray(batch));

				if (Array.isArray(batch) && batch.length > 0) {
					if (batch.length === batchSize || idx === chunks.length - 1) {
						await index.upsert(batch);

						batch = [];
					}
				} else {
					console.log('batch is not an array');
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
};

export const queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question) => {
	console.log('Querying Pinecone vector store');

	const index = client.Index(indexName);

	const queryEmbedding = await new OpenAIEmbeddings({ openAIApiKey: process.env.open_ai_api_key }).embedQuery(question);

	let queryResponse = await index.query({
		topK: 10,
		vector: queryEmbedding,
	});

	console.log(`Found ${queryResponse.matches.length} matches...`);

	console.log(`Asking question: ${question}...`);

	if (queryResponse.matches.length) {
		const llm = new OpenAI({ openAIApiKey: process.env.open_ai_api_key });
		const chain = loadQAStuffChain(llm);

		const concatenatedPageContent = queryResponse.matches
			.map((match) => {
				if (match.metadata && match.metadata.pageContent) {
					return match.metadata.pageContent;
				} else {
					return ''; // or handle the case where metadata or pageContent is missing
				}
			})
			.join(' ');

		console.log('finished');
		const result = await chain.call({
			input_documents: [new Document({ pageContent: concatenatedPageContent })],
			question: question,
		});

		console.log(`Answer: ${result.text}`);
		return result.text;
	} else {
		console.log('Since there are no matches..GPT 3.5	 will not be queried');
	}
};
