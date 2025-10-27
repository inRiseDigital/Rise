import os
import asyncio
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from schema import ChatRequest, ChatResponse, ContactRequest
from fastapi_limiter import FastAPILimiter
from redis.asyncio import Redis
from sqlalchemy.orm import Session
from database import get_db, Contact
from utils import logger, tool_data
from agent import get_chat_response
from service import warm_vector_store_cache, get_cached_graph, warm_graph_cache


guest_router = APIRouter(
    prefix="/guest", 
    tags=["Guest"]
)

# Initialize rate limiter
@guest_router.on_event("startup")
async def startup_event():
    """
    Called during the "startup" event of the FastAPI application,
    responsible for initializing the FastAPILimiter extension and
    warming up the vector store and graph caches.
    """
    logger.info("Chat router startup event triggered.")
    # redis_client = Redis.from_url(os.environ["REDIS_URL"])
    # await FastAPILimiter.init(redis_client)
    
    # await asyncio.gather(warm_vector_store_cache(), warm_graph_cache())
    logger.info("Vector store cache warmed up during chat router startup.")
    logger.info("Graph cache warmed up during chat router startup.")



@guest_router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Handles chat requests to the chatbot.

    Parameters:
        request (ChatRequest): A ChatRequest object containing the chat request details.
        db (Session): An SQLAlchemy database session.

    Returns:
        ChatResponse: A ChatResponse object containing the chatbot's response.

    Raises:
        HTTPException: If an error occurs during request processing.
    """
    tool_data.clear()

    try:
        graph = await get_cached_graph()
        response = await get_chat_response(graph=graph,
                                            question=request.message,
                                            thread_id=request.thread_id
                                        )
            

            
        return ChatResponse(
            thread_id=request.thread_id,
            response=response, 
            data=tool_data
        )

    except Exception as e:
        logger.error(f"Chat processing failed for thread_id='{request.thread_id}': {str(e)}")
        raise HTTPException(status_code=500, detail="An internal error occurred while processing the request.")


@guest_router.post("/contact")
async def contact(request: ContactRequest, db: Session = Depends(get_db)):
    try:
        contact = Contact(
            name=request.name,
            company_web=request.company_web,
            email=request.email,
            phone=request.phone,
            topic=request.topic,
            description=request.description
        )
        
        db.add(contact)
        await db.commit()
        await db.refresh(contact)

        response_message = "Thank you for contacting us! We will get back to you soon."

        return JSONResponse(content={"message": response_message}, status_code=201)
    except Exception as e:
        logger.error(f"Contact processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail="An internal error occurred while processing the request.")
