from datetime import datetime, timedelta

from app.database import Base, SessionLocal, engine
from app.models import (
    ActionItem,
    Meeting,
    Participant,
    Topic,
    TranscriptSegment,
)

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    existing = db.query(Meeting).first()

    if existing:
        print("Database already contains meetings. Skipping seed.")
        raise SystemExit

    now = datetime.utcnow()

    meeting = Meeting(
        title="Weekly Product Sync",
        meeting_date=now - timedelta(days=2),
        duration=2520,
        summary=(
            "The team reviewed progress on the new analytics dashboard, "
            "discussed performance testing, and confirmed the upcoming "
            "launch timeline."
        ),
    )

    db.add(meeting)
    db.flush()

    participants = [
        Participant(
            meeting_id=meeting.id,
            name="Alex Johnson",
            email="alex@example.com",
        ),
        Participant(
            meeting_id=meeting.id,
            name="Sarah Chen",
            email="sarah@example.com",
        ),
        Participant(
            meeting_id=meeting.id,
            name="David Miller",
            email="david@example.com",
        ),
    ]

    db.add_all(participants)

    transcript = [
        TranscriptSegment(
            meeting_id=meeting.id,
            speaker="Alex Johnson",
            start_time=0,
            end_time=14,
            segment_order=1,
            text="Thanks everyone for joining. Let's start with the product update.",
        ),
        TranscriptSegment(
            meeting_id=meeting.id,
            speaker="Sarah Chen",
            start_time=14,
            end_time=31,
            segment_order=2,
            text="The analytics dashboard is feature complete and the team has started performance testing.",
        ),
        TranscriptSegment(
            meeting_id=meeting.id,
            speaker="David Miller",
            start_time=31,
            end_time=49,
            segment_order=3,
            text="The API integration is also complete. We found two minor issues during load testing.",
        ),
        TranscriptSegment(
            meeting_id=meeting.id,
            speaker="Alex Johnson",
            start_time=49,
            end_time=66,
            segment_order=4,
            text="Let's prioritise those fixes and keep the Friday deployment target.",
        ),
        TranscriptSegment(
            meeting_id=meeting.id,
            speaker="Sarah Chen",
            start_time=66,
            end_time=84,
            segment_order=5,
            text="That works. I'll coordinate final QA and prepare the release checklist.",
        ),
    ]

    db.add_all(transcript)

    db.add_all(
        [
            Topic(
                meeting_id=meeting.id,
                name="Analytics Dashboard",
            ),
            Topic(
                meeting_id=meeting.id,
                name="Performance Testing",
            ),
            Topic(
                meeting_id=meeting.id,
                name="Launch Timeline",
            ),
        ]
    )

    db.add_all(
        [
            ActionItem(
                meeting_id=meeting.id,
                description="Fix remaining load testing issues",
                assignee="David Miller",
                completed=False,
            ),
            ActionItem(
                meeting_id=meeting.id,
                description="Complete final QA",
                assignee="Sarah Chen",
                completed=False,
            ),
            ActionItem(
                meeting_id=meeting.id,
                description="Prepare release checklist",
                assignee="Sarah Chen",
                completed=False,
            ),
        ]
    )

    db.commit()

    print("Production demo data created successfully.")

finally:
    db.close()