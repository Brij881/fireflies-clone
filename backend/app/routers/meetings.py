from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from app.database import get_db
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.schemas.meeting import (
    MeetingCreate,
    MeetingResponse,
    MeetingUpdate,
)

router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"]
)


@router.post("", response_model=MeetingResponse, status_code=201)
def create_meeting(
    data: MeetingCreate,
    db: Session = Depends(get_db)
):
    meeting = Meeting(
        title=data.title,
        meeting_date=data.meeting_date,
        duration=data.duration,
        summary=data.summary
    )

    for participant in data.participants:
        meeting.participants.append(
            Participant(
                name=participant.name,
                email=participant.email
            )
        )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


@router.get("", response_model=list[MeetingResponse])
def get_meetings(
    search: str | None = None,
    participant: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    sort: str = Query(default="recent"),
    db: Session = Depends(get_db)
):
    query = db.query(Meeting).options(
        joinedload(Meeting.participants)
    )

    if search:
        query = query.filter(
            Meeting.title.ilike(f"%{search}%")
        )

    if participant:
        query = (
            query
            .join(Meeting.participants)
            .filter(
                Participant.name.ilike(f"%{participant}%")
            )
        )
    if date_from:
        query = query.filter(
            Meeting.meeting_date >= date_from
        )

    if date_to:
        query = query.filter(
            Meeting.meeting_date <= date_to
        )
    
    if sort == "oldest":
        query = query.order_by(Meeting.meeting_date.asc())
    else:
        query = query.order_by(Meeting.meeting_date.desc())

    return query.all()


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    meeting = (
        db.query(Meeting)
        .options(joinedload(Meeting.participants))
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    return meeting


@router.patch("/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    meeting_id: int,
    data: MeetingUpdate,
    db: Session = Depends(get_db)
):
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

    update_data = data.model_dump(
        exclude_unset=True,
        exclude={"participants"}
    )

    for key, value in update_data.items():
        setattr(meeting, key, value)

    if data.participants is not None:
        meeting.participants.clear()

        for participant in data.participants:
            meeting.participants.append(
                Participant(
                    name=participant.name,
                    email=participant.email
                )
            )

    db.commit()
    db.refresh(meeting)

    return meeting


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
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

    db.delete(meeting)
    db.commit()