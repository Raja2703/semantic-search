import { Pinecone } from '@pinecone-database/pinecone';
import { queryPineconeVectorStoreAndQueryLLM } from '../../../../utils';
import { indexName } from '../../../../config';

export async function POST(req, res) {
	const body = await req.json();
	const client = new Pinecone({
		apiKey: process.env.pinecone_api_key || '',
	});

	const text = await queryPineconeVectorStoreAndQueryLLM(client, indexName, body);
	return res.json({
		data: text,
	});
}
