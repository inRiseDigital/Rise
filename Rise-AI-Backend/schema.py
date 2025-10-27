from pydantic import BaseModel, EmailStr
from typing import Optional


class ChatRequest(BaseModel):
    thread_id: str = "1"
    message: str = "Hello"
    

class ChatResponse(BaseModel):
    thread_id: str
    response: str
    data: Optional[list] = None
    
    
class ContactRequest(BaseModel):
    name: str
    company_web: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    topic: Optional[str] = None
    description: Optional[str] = None
