import asyncio
from utils import logger
from cachetools import LRUCache
from utils import agent_name


prompt_cache = LRUCache(maxsize=512) 
_prompt_lock = asyncio.Lock()

graph_cache = LRUCache(maxsize=512)
_graph_lock = asyncio.Lock()






async def get_cached_graph():
    """
    Retrieve a graph from the cache or database for a given name.

    Args:
        name (str): The name for which to retrieve the graph.
        db (AsyncSession): The asynchronous database session to use for database operations.

    Returns:
        agent.Graph: The graph associated with the given name.

    Note:
        If the graph is not present in the cache, it is loaded from the database and cached for future access.
    """
    from agent import build_graph  # Local import to avoid circular dependency
    async with _graph_lock:
        if agent_name in graph_cache:
            return graph_cache[agent_name]

    graph = await build_graph()

    async with _graph_lock:
        graph_cache[agent_name] = graph

    return graph


async def warm_graph_cache():
    """
    Warm the graph and prompt caches by loading all prompts and their associated graphs from the database.

    This function is called during startup to pre-warm the caches before the first request is received.

    If any errors occur during the cache warming process, an error message is logged, but startup will continue.
    """
    try:
        await get_cached_graph()
        logger.info(f"Graph cache built for '{agent_name}'.")
    except Exception as e:
        logger.error(f"Error building graph for '{agent_name}': {e}")
        
        logger.info("Graph and prompt cache warmed up during chat router startup.")
    except Exception as e:
        logger.error(f"Startup cache warming failed: {e}")
        