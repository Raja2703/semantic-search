'use client';

import { useState } from 'react';

export default function Home() {
	const [query, setQuery] = useState();
	const [result, setResult] = useState();
	const [loading, setLoading] = useState(false);

	async function createIndexAndEmbeddings() {
		try {
			const result = await fetch('/api/setup', {
				method: 'POST',
			});

			const json = await result.json();
			console.log('result: ', json);
		} catch (err) {
			console.log(err);
		}
	}

	async function sendQuery() {
		if (!query) return;
		setResult('');
		setLoading(true);
		try {
			const result = await fetch('/api/read', {
				method: 'POST',
				body: JSON.stringify(query),
			});

			const json = await result.json();
			setResult(json.data);
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	}
	return (
		<div>
			<nav className="h-16 flex justify-center items-center">
				<h1 className="text-2xl">Gen AI</h1>
			</nav>
			<main className="bg-white flex min-h-screen flex-col items-center gap-5 p-24">
				<input placeholder="ask me a question" className="text-black px-2 py-1 border border-black" onChange={(e) => setQuery(e.target.value)} />
				<button className="px-2 py-1 rounded-md text-black border border-black" onClick={sendQuery}>
					ASK AI
				</button>
				{loading && <p className="text-black">Asking AI</p>}
				{result && <p className="text-black">{result}</p>}
				<button onClick={createIndexAndEmbeddings} className="text-black border border-black px-3 py-1 rounded-md">
					Create Index and Embeddings
				</button>
			</main>
		</div>
	);
}
