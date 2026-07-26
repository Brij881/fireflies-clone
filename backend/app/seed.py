from datetime import datetime, timedelta, timezone

from app.database import Base, SessionLocal, engine
from app.models import (
    ActionItem,
    Meeting,
    Participant,
    Topic,
    TranscriptSegment,
)


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing = db.query(Meeting).first()

        if existing:
            print("Database already contains meetings. Skipping seed.")
            return

        now = datetime.now(timezone.utc)

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
                text=(
                    "Thanks everyone for joining. "
                    "Let's start with the product update."
                ),
            ),
            TranscriptSegment(
                meeting_id=meeting.id,
                speaker="Sarah Chen",
                start_time=14,
                end_time=31,
                segment_order=2,
                text=(
                    "The analytics dashboard is feature complete "
                    "and the team has started performance testing."
                ),
            ),
            TranscriptSegment(
                meeting_id=meeting.id,
                speaker="David Miller",
                start_time=31,
                end_time=49,
                segment_order=3,
                text=(
                    "The API integration is also complete. "
                    "We found two minor issues during load testing."
                ),
            ),
            TranscriptSegment(
                meeting_id=meeting.id,
                speaker="Alex Johnson",
                start_time=49,
                end_time=66,
                segment_order=4,
                text=(
                    "Let's prioritise those fixes and keep "
                    "the Friday deployment target."
                ),
            ),
            TranscriptSegment(
                meeting_id=meeting.id,
                speaker="Sarah Chen",
                start_time=66,
                end_time=84,
                segment_order=5,
                text=(
                    "That works. I'll coordinate final QA "
                    "and prepare the release checklist."
                ),
            ),
        ]

        db.add_all(transcript)

        topics = [
            Topic(
                meeting_id=meeting.id,
                title="Analytics Dashboard",
                start_time=14,
                description="Progress and feature completion of the analytics dashboard.",
            ),
            Topic(
                meeting_id=meeting.id,
                title="Performance Testing",
                start_time=31,
                description="API integration, load testing, and remaining performance issues.",
            ),
            Topic(
                meeting_id=meeting.id,
                title="Launch Timeline",
                start_time=49,
                description="Final QA, release preparation, and the Friday deployment target.",
            ),
        ]

        db.add_all(topics)

        action_items = [
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

        db.add_all(action_items)

        db.commit()

        print("Demo data created successfully.")

    except Exception as error:
        db.rollback()
        print(f"Failed to seed database: {error}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()