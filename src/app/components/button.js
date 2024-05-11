'use client';
import React from 'react';
import { Button } from './../ui/moving-border.tsx';

export function MovingBorder({ createIndexAndEmbeddings }) {
	return (
		<div onClick={createIndexAndEmbeddings}>
			<Button borderRadius="1rem" className="bg-white dark:bg-slate-900 text-black dark:text-white border-blue-300  dark:border-zinc-800">
				Create Index and Embeddings
			</Button>
		</div>
	);
}
