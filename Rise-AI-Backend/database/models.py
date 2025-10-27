from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean
from datetime import datetime
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<Project(name={self.name}, budget={self.budget})>"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "budget": self.budget,
            "is_active": self.is_active,
        }


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    role = Column(String(50), nullable=False)

    def __repr__(self):
        return f"<Team(name={self.name}, role={self.role})>"
    
    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "role": self.role,
        }


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    company_web = Column(String(100), nullable=True)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    topic = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Contact(name={self.name}, email={self.email})>"

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
        }