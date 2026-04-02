import json
import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import redis

from database import Note, get_db, init_db

app = FastAPI(title="Notes API", description="A simple notes service for Docker Compose demo")

# Redis client — hostname matches the service name in docker-compose.yml
redis_client = redis.Redis(
    host=os.environ.get("REDIS_HOST", "redis"),
    port=6379,
    decode_responses=True,
)
CACHE_TTL = 30  # seconds


@app.on_event("startup")
def startup():
    init_db()


class NoteCreate(BaseModel):
    title: str
    content: str


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: str

    class Config:
        from_attributes = True


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/notes", response_model=NoteResponse, status_code=201)
def create_note(payload: NoteCreate, db: Session = Depends(get_db)):
    note = Note(title=payload.title, content=payload.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    # Bust the list cache whenever a new note is added
    redis_client.delete("notes:all")
    return NoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        created_at=note.created_at.isoformat(),
    )


@app.get("/notes", response_model=list[NoteResponse])
def list_notes(db: Session = Depends(get_db)):
    cached = redis_client.get("notes:all")
    if cached:
        return json.loads(cached)

    notes = db.query(Note).order_by(Note.created_at.desc()).all()
    result = [
        NoteResponse(
            id=n.id, title=n.title, content=n.content, created_at=n.created_at.isoformat()
        ).model_dump()
        for n in notes
    ]
    redis_client.setex("notes:all", CACHE_TTL, json.dumps(result))
    return result


@app.get("/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    cache_key = f"notes:{note_id}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    result = NoteResponse(
        id=note.id, title=note.title, content=note.content, created_at=note.created_at.isoformat()
    ).model_dump()
    redis_client.setex(cache_key, CACHE_TTL, json.dumps(result))
    return result


@app.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    redis_client.delete(f"notes:{note_id}")
    redis_client.delete("notes:all")
