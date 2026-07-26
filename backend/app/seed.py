from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models import (
    ActionItem,
    Meeting,
    Participant,
    Topic,
    TranscriptSegment,
)


def seed_database():
    db = SessionLocal()

    try:
        if db.query(Meeting).count() > 0:
            print("Database already seeded")
            return

        meeting = Meeting(
            title="Weekly Product Sync",
            meeting_date=datetime.now() - timedelta(days=1),
            duration=2534,
            summary=(
                "The team reviewed progress on the new analytics "
                "dashboard, discussed performance testing, and "
                "confirmed the upcoming launch timeline."
            )
        )

        meeting.participants = [
            Participant(
                name="Alex Johnson",
                email="alex@example.com"
            ),
            Participant(
                name="Sarah Chen",
                email="sarah@example.com"
            ),
            Participant(
                name="David Miller",
                email="david@example.com"
            ),
        ]

        meeting.transcript_segments = [
            TranscriptSegment(
                speaker="Alex Johnson",
                start_time=0,
                end_time=8,
                segment_order=1,
                text="Thanks everyone for joining the weekly product sync."
            ),
            TranscriptSegment(
                speaker="Sarah Chen",
                start_time=8,
                end_time=20,
                segment_order=2,
                text=(
                    "Engineering finished the analytics dashboard "
                    "and we are preparing it for launch."
                )
            ),
            TranscriptSegment(
                speaker="David Miller",
                start_time=20,
                end_time=34,
                segment_order=3,
                text=(
                    "Performance looks good overall, but we still "
                    "need to complete load testing."
                )
            ),
            TranscriptSegment(
                speaker="Alex Johnson",
                start_time=34,
                end_time=47,
                segment_order=4,
                text=(
                    "Let's complete testing before Friday so that "
                    "we can stay on the launch schedule."
                )
            ),
            TranscriptSegment(
                speaker="Sarah Chen",
                start_time=47,
                end_time=60,
                segment_order=5,
                text=(
                    "I'll also prepare the launch announcement "
                    "and coordinate with marketing."
                )
            ),
        ]

        meeting.action_items = [
            ActionItem(
                description="Complete load testing before Friday",
                assignee="David Miller"
            ),
            ActionItem(
                description="Prepare the launch announcement",
                assignee="Sarah Chen"
            ),
            ActionItem(
                description="Review final launch checklist",
                assignee="Alex Johnson"
            ),
        ]

        meeting.topics = [
            Topic(
                title="Project Updates",
                start_time=0,
                description="Review of current engineering progress."
            ),
            Topic(
                title="Performance Testing",
                start_time=20,
                description="Discussion about remaining load testing."
            ),
            Topic(
                title="Launch Planning",
                start_time=34,
                description="Timeline and responsibilities for launch."
            ),
        ]

        db.add(meeting)

        second = Meeting(
            title="Customer Feedback Review",
            meeting_date=datetime.now() - timedelta(days=3),
            duration=1845,
            summary=(
                "The product team reviewed recent customer feedback "
                "and prioritised improvements to onboarding and search."
            )
        )

        second.participants = [
            Participant(name="Emma Wilson"),
            Participant(name="Michael Brown"),
            Participant(name="Sarah Chen"),
        ]

        second.transcript_segments = [
            TranscriptSegment(
                speaker="Emma Wilson",
                start_time=0,
                end_time=12,
                segment_order=1,
                text=(
                    "The biggest theme from customer interviews "
                    "was difficulty during onboarding."
                )
            ),
            TranscriptSegment(
                speaker="Michael Brown",
                start_time=12,
                end_time=27,
                segment_order=2,
                text=(
                    "We also received several requests for faster "
                    "meeting search and better filters."
                )
            ),
            TranscriptSegment(
                speaker="Sarah Chen",
                start_time=27,
                end_time=42,
                segment_order=3,
                text=(
                    "Engineering can prioritise the search improvements "
                    "in the next sprint."
                )
            ),
        ]

        second.action_items = [
            ActionItem(
                description="Redesign onboarding flow",
                assignee="Emma Wilson"
            ),
            ActionItem(
                description="Create search improvement proposal",
                assignee="Sarah Chen"
            ),
        ]

        second.topics = [
            Topic(
                title="Customer Feedback",
                start_time=0
            ),
            Topic(
                title="Search Improvements",
                start_time=12
            ),
        ]

        db.add(second)

        third = Meeting(
            title="Q3 Marketing Strategy",
            meeting_date=datetime.now() - timedelta(days=7),
            duration=3210,
            summary=(
                "The marketing team discussed Q3 campaign priorities, "
                "content strategy, and the product launch campaign."
            )
        )

        third.participants = [
            Participant(name="Olivia Davis"),
            Participant(name="James Taylor"),
            Participant(name="Alex Johnson"),
        ]

        third.transcript_segments = [
            TranscriptSegment(
                speaker="Olivia Davis",
                start_time=0,
                end_time=15,
                segment_order=1,
                text="Let's review our priorities for the Q3 campaign."
            ),
            TranscriptSegment(
                speaker="James Taylor",
                start_time=15,
                end_time=30,
                segment_order=2,
                text=(
                    "The product launch should be our main campaign "
                    "for the first half of the quarter."
                )
            ),
            TranscriptSegment(
                speaker="Alex Johnson",
                start_time=30,
                end_time=44,
                segment_order=3,
                text=(
                    "Product can provide screenshots and demo "
                    "material by next week."
                )
            ),
        ]

        third.action_items = [
            ActionItem(
                description="Prepare Q3 campaign brief",
                assignee="Olivia Davis"
            ),
            ActionItem(
                description="Provide product demo assets",
                assignee="Alex Johnson"
            ),
        ]

        third.topics = [
            Topic(
                title="Q3 Priorities",
                start_time=0
            ),
            Topic(
                title="Product Launch Campaign",
                start_time=15
            ),
        ]

        db.add(third)

        db.commit()

        print("Database seeded successfully")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()