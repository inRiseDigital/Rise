from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig
from service import get_cached_vector_store
from utils import logger


@tool
async def lookup_informations(query: str) -> str:
    """
    Retrieves information from a vector store using a query.

    Args:
        query (str): The query to search the vector store with.

    Returns:
        str: The retrieved information as a string.

    Raises:
        Exception: If an error occurs while looking up information. The exception
            message is included in the returned string.
    """
    try:

        vector_store = await get_cached_vector_store()

        retriever = await vector_store.query_vector_store() if vector_store else None
        
        if not retriever:
            return "No information available for the query."


        docs = await retriever.asimilarity_search(query=query)
        
        
                
        docs = "\n\n".join([doc.page_content for doc in docs])
                
        return docs
    except Exception as e:
        logger.error(f"Error during lookup_informations: {str(e)}")
        return f"An error occurred while looking up information: {str(e)}"

