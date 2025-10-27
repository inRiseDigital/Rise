import os
from utils import embeddings, agent_name
from dotenv import load_dotenv, find_dotenv
from langchain_experimental.text_splitter import SemanticChunker
from langchain_qdrant import QdrantVectorStore, FastEmbedSparse, RetrievalMode
from qdrant_client import QdrantClient

from uuid import uuid4


load_dotenv(find_dotenv())

class Qdrant_VectorStore:
    def __init__(self, name:str=agent_name) -> None:
        """
        Initializes a Qdrant Vector Store.

        Args:
            name (str): The name of the collection to create in Qdrant. Defaults to "Rama".

        Attributes:
            collection_name (str): The name of the collection in Qdrant.
            QDRANT_ENDPOINT (str): The URL of the Qdrant instance.
            QDRANT_API_KEY (str): The API key for the Qdrant instance.
            sparse_embeddings (FastEmbedSparse): The sparse embeddings model to use for retrieval.
        """
        self.collection_name = name
        self.QDRANT_ENDPOINT = os.getenv("QDRANT_URL")
        self.QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
        self.sparse_embeddings = FastEmbedSparse(model_name="Qdrant/bm25")

    async def build_vector_store(self, documents: str) -> QdrantVectorStore:
        """
        Builds a Qdrant Vector Store from a given set of documents.

        This method takes in a string of documents, splits them into
        chunks using the Langchain Semantic Chunker, and then creates
        a Qdrant Vector Store containing the chunked documents. The
        vector store is built with the following parameters:
        embeddings: embeddings
        url: self.QDRANT_ENDPOINT
        api_key: self.QDRANT_API_KEY
        collection_name: self.collection_name
        sparse_embedding: self.sparse_embeddings
        retrieval_mode: RetrievalMode.HYBRID
        vector_name: "dense"
        sparse_vector_name: "sparse"

        Args:
            documents (str): The string of documents to build the vector store from
        """
        chunker=SemanticChunker(
            embeddings=embeddings,
        )

        chunked_texts = chunker.split_text(
            text=documents
        )
                        
        qdrant = QdrantVectorStore.from_texts(
            texts=chunked_texts,
            embedding=embeddings,
            url=self.QDRANT_ENDPOINT,
            api_key=self.QDRANT_API_KEY,
            collection_name=self.collection_name,
            sparse_embedding=self.sparse_embeddings,
            retrieval_mode=RetrievalMode.HYBRID,
            vector_name="dense",
            sparse_vector_name="sparse",
        )
        
        """qdrant = QdrantVectorStore.from_texts(
            texts=chunked_documents,
            embedding=embeddings,
            url=self.QDRANT_ENDPOINT,
            api_key=self.QDRANT_API_KEY,
            collection_name=self.collection_name,
            sparse_embedding= self.sparse_embeddings,
            retrieval_mode=RetrievalMode.HYBRID,
            vector_name="dense",
            sparse_vector_name="sparse"
        )"""
        
        return qdrant

    async def query_vector_store(self):
        """
        Queries an existing Qdrant vector store collection.

        This method retrieves the Qdrant vector store associated with the specified 
        collection name using the provided embeddings, API endpoint, and other 
        configurations. It supports hybrid retrieval mode using dense and sparse 
        embeddings.

        Returns:
            QdrantVectorStore: The Qdrant vector store for the specified collection.
        """

        qdrant=QdrantVectorStore.from_existing_collection(
            embedding=embeddings,
            url=self.QDRANT_ENDPOINT,
            api_key=self.QDRANT_API_KEY,
            collection_name=self.collection_name,
            sparse_embedding= self.sparse_embeddings,
            retrieval_mode=RetrievalMode.HYBRID,
            vector_name="dense",
            sparse_vector_name="sparse"
        )
        
        return qdrant
    
    async def delete_vector_store(self):
        """
        Deletes the Qdrant vector store collection.

        This method deletes the vector store associated with the specified 
        collection name.

        Returns:
            None
        """
        try:
            client = QdrantClient(
                url=self.QDRANT_ENDPOINT,
                api_key=self.QDRANT_API_KEY
            )
            
            client.delete_collection(
                collection_name=self.collection_name
            )
        except Exception as e:
            raise Exception(f"Error deleting vector store: {str(e)}")