from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.meeting import Meeting
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicResponse


router = APIRouter(
    prefix="/api/meetings",
    tags=["Topics"]
)


def get_meeting_or_404(meeting_id: int, db: Session):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    return meeting


@router.get(
    "/{meeting_id}/topics",
    response_model=list[TopicResponse]
)
def get_topics(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    get_meeting_or_404(meeting_id, db)

    return (
        db.query(Topic)
        .filter(Topic.meeting_id == meeting_id)
        .order_by(Topic.start_time.asc())
        .all()
    )


@router.post(
    "/{meeting_id}/topics",
    response_model=TopicResponse,
    status_code=201
)
def create_topic(
    meeting_id: int,
    data: TopicCreate,
    db: Session = Depends(get_db)
):
    get_meeting_or_404(meeting_id, db)

    topic = Topic(
        meeting_id=meeting_id,
        title=data.title,
        start_time=data.start_time,
        description=data.description
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return topic