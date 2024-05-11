# Text Summarization Project

This project is a text summarization application developed using [Next.js]() and [Langchain.js](https://js.langchain.com/docs/get_started/introduction).  
It utilizes the [OpenAI API](https://platform.openai.com/) and [Pinecone](https://www.pinecone.io/) vector database to summarize PDF documents.

## Features
- **PDF Input:** Users can upload PDF documents as input to the application.
- **Text Embedding:** The application employs the OpenAI API to embed the text content of PDF documents.
- **Vector Database:** Utilizes Pinecone vector database to store the embeddings of the PDF documents.
- **Querying:** Users can query the database using the OpenAI API to retrieve summarized versions of the documents.

## Technologies Used
- **Next.js:** A React framework for building server-side rendered and static web applications.
- **Langchain.js:** A JavaScript library for language processing tasks.
- **OpenAI API:** Provides access to powerful natural language processing models.
- **Pinecone Vector Database:** A fast, scalable, and cloud-based vector database for storing and querying high-dimensional data.

## How it Works
1. **PDF Input:** Users upload PDF documents through the application interface.  
2. **Text Embedding:** The application extracts text from the uploaded PDF documents and sends it to the OpenAI API for embedding.  
3. **Vector Storage:** The embedded text is stored in the Pinecone vector database for efficient querying.  
3. **Querying:** Users can input queries through the application, which are sent to the OpenAI API to find similar documents in the database.  
4. **Summarization:** The application retrieves the most relevant documents based on the query and provides summarized versions to the user.  

## To use this application

```bash
git clone git@github.com:Raja2703/semantic-search.git
cd semantic-search

```
install dependencies using

```bash
npm install
```
**Set up accounts and obtain API keys for OpenAI and Pinecone.**

**Create a .env file and paste the api keys in**
```
pinecone_api_key =  
pinecone_env =  
open_ai_api_key =  
```

run the application
```
npm run dev
# or
yarn dev
```

