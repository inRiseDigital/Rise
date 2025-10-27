from langchain.storage import InMemoryStore
from utils.qdrant_store import Qdrant_VectorStore
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter


class Retriever:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self.parent_store = InMemoryStore()
        self.child_store = Qdrant_VectorStore(name=collection_name)
        self.embeddings = OpenAIEmbeddings()
        
    def build_vector_store(self, documents: str):
        pass
        
    