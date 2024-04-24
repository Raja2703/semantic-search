import { Pinecone } from '@pinecone-database/pinecone';
import { queryPineconeVectorStoreAndQueryLLM } from '../../../../utils';
import { indexName } from '../../../../config';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const body = await req.json();
		const client = new Pinecone({
			apiKey: process.env.pinecone_api_key || '',
		});

		const text = await queryPineconeVectorStoreAndQueryLLM(client, indexName, body);

		return NextResponse.json({
			data: text,
		});
	} catch (err) {
		console.log('hello err: ', err);
	}
}
