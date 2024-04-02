import { Pinecone } from '@pinecone-database/pinecone';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { createPineconeIndex, updatePinecone } from '../../../../utils';
import { indexName } from '../../../../config';
import { NextResponse } from 'next/server';

export async function POST() {
	const loader = new DirectoryLoader('D:/Personal projects/semanticsearch/src/document', {
		'.txt': (path) => new TextLoader(path),
		'.md': (path) => new TextLoader(path),
		'.pdf': (path) => new PDFLoader(path),
	});

	const docs = await loader.load();
	const vectorDimensions = 768;

	const client = new Pinecone({
		apiKey: process.env.pinecone_api_key || '',
	});

	try {
		await createPineconeIndex(client, indexName, vectorDimensions);
		await updatePinecone(client, indexName, docs);
	} catch (err) {
		console.log(err);
	}

	return NextResponse.json({
		data: 'successfully created index and loaded data into pinecone',
	});
}
