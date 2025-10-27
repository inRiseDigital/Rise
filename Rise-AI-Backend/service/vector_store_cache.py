import asyncio
from utils import agent_name
from utils import logger
from utils import Qdrant_VectorStore
from cachetools import LRUCache
from threading import Lock


vector_store_cache = LRUCache(maxsize=64)
_vector_cache_lock = Lock()

async def get_cached_vector_store() -> Qdrant_VectorStore:
    """
    Retrieves a Qdrant_VectorStore from the cache or creates a new one if not present.

    Args:
        name (str): The name of the website for which the vector store is being requested.

    Returns:
        Qdrant_VectorStore: The Qdrant_VectorStore associated with the given website name.
    """

    loop = asyncio.get_running_loop()
    with _vector_cache_lock:
        if agent_name in vector_store_cache:
            return vector_store_cache[agent_name]
    # Create VectorStore outside the lock to avoid blocking
    vector_store = await loop.run_in_executor(None, Qdrant_VectorStore, agent_name)
    with _vector_cache_lock:
        vector_store_cache[agent_name] = vector_store
    return vector_store

async def warm_vector_store_cache():
    """
    Warm the vector store cache by pre-loading all vector stores from the database.

    This function is called during startup to ensure that the vector stores
    are cached before the first request is received. It retrieves all names
    from the database and pre-loads their associated vector stores.

    Logs a success message if all vector stores are pre-loaded successfully.
    Logs a warning message if any errors occur during the cache warming process.
    """

    try:
        tasks = [get_cached_vector_store()]
        await asyncio.gather(*tasks)
        logger.info("All vector stores pre-loaded successfully.")

    except Exception as e:
        logger.warning(f"Error during vector store cache warming: {e}")



