from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.meeting import Meeting
from app.models.transcript import TranscriptSegment
from app.schemas.transcript import (
    TranscriptSegmentCreate,
    TranscriptSegmentResponse,
)

router = APIRouter(
    prefix="/api/meetings",
    tags=["Transcripts"]
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
    "/{meeting_id}/transcript",
    response_model=list[TranscriptSegmentResponse]
)
def get_transcript(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    get_meeting_or_404(meeting_id, db)

    return (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.segment_order.asc())
        .all()
    )


@router.post(
    "/{meeting_id}/transcript",
    response_model=list[TranscriptSegmentResponse],
    status_code=201
)
def add_transcript(
    meeting_id: int,
    segments: list[TranscriptSegmentCreate],
    db: Session = Depends(get_db)
):
    get_meeting_or_404(meeting_id, db)

    created = []

    for data in segments:
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker=data.speaker,
            start_time=data.start_time,
            end_time=data.end_time,
            text=data.text,
            segment_order=data.segment_order
        )

        db.add(segment)
        created.append(segment)

    db.commit()

    for segment in created:
        db.refresh(segment)

    return created


@router.get(
    "/{meeting_id}/transcript/search",
    response_model=list[TranscriptSegmentResponse]
)
def search_transcript(
    meeting_id: int,
    q: str = Query(min_length=1),
    db: Session = Depends(get_db)
):
    get_meeting_or_404(meeting_id, db)

    return (
        db.query(TranscriptSegment)
        .filter(
            TranscriptSegment.meeting_id == meeting_id,
            TranscriptSegment.text.ilike(f"%{q}%")
        )
        .order_by(TranscriptSegment.segment_order.asc())
        .all()
    )