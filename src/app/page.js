'use client';

import Image from 'next/image';
import { useState } from 'react';
import loader from './../../public/loader.gif';
import { MovingBorder } from './components/button';

export default function Home() {
	const [query, setQuery] = useState();
	const [result, setResult] = useState();
	const [loading, setLoading] = useState(false);
	const [classNameMain, setClassName] = useState('h-screen');

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

			// 			const tempResult = `The document discusses React, a JavaScript library for building
			// user interfaces, focusing on its core concepts, usage, JSX syntax,
			// and building components. Here's a summary of the key points:

			// 1. What is React?: React is a JavaScript library for building
			// user interfaces. It revolves around the concept of components,
			// which are self-contained modules that generate output. Components
			// can be composed together to form more complex UI structures.

			// 2. How to Use React: React can be included in HTML files using
			// tags, and its features can be accessed in JavaScript code. The
			// document provides a simple "Hello World" example demonstrating
			// how to use React to render content on a webpage.

			// 3.Virtual DOM: React operates on a virtual DOM, which is an
			// in-memory representation of the web browser's DOM. Changes to
			// the virtual DOM are efficiently applied to the actual DOM,
			// resulting in better performance.

			// 4. JSX: JSX is a syntax extension for JavaScript that allows
			// developers to write HTML-like code within JavaScript files. JSX
			// code is transformed into regular JavaScript at runtime. It
			// simplifies the process of writing React components and makes the
			// code more readable.

			// 5. ES6 and ES7: The document briefly discusses ECMAScript 6 (ES6)
			// and ECMAScript 7 (ES7), highlighting their features and benefits.
			// Babel, a tool for transpiling ES6 and ES7 code to ES5, is
			// mentioned as a way to ensure compatibility across different
			// browsers.

			// Overall, the document serves as an introductory guide to React,
			//  covering its fundamental concepts and providing practical examples
			//  to help developers get started with building React applications.`;
			// setTimeout(() => {
			// 	setLoading(false);
			// 	setClassName('h-full');
			// 	setResult(json);
			// }, 3000);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	}
	return (
		<div className={classNameMain}>
			<nav className="h-[10%] flex justify-center items-center bg-sky-600">
				<h1 className="text-2xl">Text summarizer</h1>
			</nav>
			<main className="flex h-[90%] bg-white gap-5 p-24">
				<div className="w-[40%] flex flex-col items-center">
					<div className="flex gap-5 mb-5">
						<input placeholder="ask me a question" className="h-10 outline-none rounded text-black px-2 py-1 border border-blue-700" onChange={(e) => setQuery(e.target.value)} />
						<button className="px-2 py-1 rounded-md text-white bg-sky-600" onClick={sendQuery}>
							ASK AI
						</button>
					</div>
					<MovingBorder createIndexAndEmbeddings={createIndexAndEmbeddings} />
				</div>
				<div className="border border-black p-10 w-[65%]">
					{loading && (
						<div className="h-full w-full flex justify-center items-center">
							{' '}
							<Image unoptimized={true} src={loader} alt="gif" className="h-32 w-32" />
						</div>
					)}
					{result && <p className="text-neutral-800 text-2xl font-semibold mb-10">And the answer for your question is</p>}
					{result && <pre className="text-black text-lg">{result}</pre>}
				</div>
			</main>
		</div>
	);
}
