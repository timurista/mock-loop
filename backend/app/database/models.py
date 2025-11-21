"""Database models for MockLoop API."""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


class User(Base):
    """User model for authentication and profiles."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Interview(Base):
    """Interview session model."""

    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(20), unique=True, index=True, nullable=True)  # Semantic session ID like 'isession-abc123def'
    user_id = Column(Integer, nullable=False)  # FK to users table
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(50), default="medium")  # easy, medium, hard
    status = Column(String(50), default="pending")  # pending, in_progress, completed, cancelled

    # Configuration settings
    config = Column(JSON, nullable=True)  # Store interview configuration as JSON

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


class InterviewMessage(Base):
    """Messages exchanged during an interview session."""

    __tablename__ = "interview_messages"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, nullable=False)  # FK to interviews table
    role = Column(String(50), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    message_metadata = Column(JSON, nullable=True)  # Store additional message metadata
    timestamp = Column(DateTime, default=datetime.utcnow)


class Scorecard(Base):
    """Interview evaluation and scoring."""

    __tablename__ = "scorecards"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, nullable=False)  # FK to interviews table
    evaluator_type = Column(String(50), default="ai")  # ai, human, peer

    # Scoring
    overall_score = Column(Integer, nullable=True)  # 1-100
    technical_score = Column(Integer, nullable=True)
    communication_score = Column(Integer, nullable=True)
    problem_solving_score = Column(Integer, nullable=True)

    # Feedback
    strengths = Column(Text, nullable=True)
    areas_for_improvement = Column(Text, nullable=True)
    detailed_feedback = Column(JSON, nullable=True)  # Structured feedback data

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Session(Base):
    """User session management."""

    __tablename__ = "sessions"

    id = Column(String(255), primary_key=True)  # Session token
    user_id = Column(Integer, nullable=False)  # FK to users table
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_accessed = Column(DateTime, default=datetime.utcnow)