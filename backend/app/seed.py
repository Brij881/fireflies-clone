from datetime import datetime, timedelta, timezone

from app.database import Base, SessionLocal, engine
from app.models import (
    ActionItem,
    Meeting,
    Participant,
    Topic,
    TranscriptSegment,
)


def add_meeting(
    db,
    title,
    date,
    duration,
    summary,
    participants,
    transcript,
    topics,
    actions,
):
    existing = (
        db.query(Meeting)
        .filter(Meeting.title == title)
        .first()
    )

    if existing:
        print(f"Skipping existing meeting: {title}")
        return

    meeting = Meeting(
        title=title,
        meeting_date=date,
        duration=duration,
        summary=summary,
    )

    db.add(meeting)
    db.flush()

    for name, email in participants:
        db.add(
            Participant(
                meeting_id=meeting.id,
                name=name,
                email=email,
            )
        )

    for order, segment in enumerate(transcript, 1):
        speaker, start, end, text = segment

        db.add(
            TranscriptSegment(
                meeting_id=meeting.id,
                speaker=speaker,
                start_time=start,
                end_time=end,
                segment_order=order,
                text=text,
            )
        )

    for title, start_time, description in topics:
        db.add(
            Topic(
                meeting_id=meeting.id,
                title=title,
                start_time=start_time,
                description=description,
            )
        )

    for description, assignee, completed in actions:
        db.add(
            ActionItem(
                meeting_id=meeting.id,
                description=description,
                assignee=assignee,
                completed=completed,
            )
        )

    print(f"Added meeting: {title}")


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        add_meeting(
            db,
            "Weekly Product Sync",
            now - timedelta(days=2),
            2520,
            (
                "The team reviewed progress on the analytics dashboard, "
                "discussed performance testing, and confirmed the "
                "upcoming launch timeline."
            ),
            [
                ("Alex Johnson", "alex@example.com"),
                ("Sarah Chen", "sarah@example.com"),
                ("David Miller", "david@example.com"),
            ],
            [
                (
                    "Alex Johnson",
                    0,
                    14,
                    "Thanks everyone for joining. Let's start with the product update.",
                ),
                (
                    "Sarah Chen",
                    14,
                    31,
                    "The analytics dashboard is feature complete and performance testing has started.",
                ),
                (
                    "David Miller",
                    31,
                    49,
                    "The API integration is complete. We found two minor issues during load testing.",
                ),
                (
                    "Alex Johnson",
                    49,
                    66,
                    "Let's prioritise those fixes and keep the Friday deployment target.",
                ),
                (
                    "Sarah Chen",
                    66,
                    84,
                    "I'll coordinate final QA and prepare the release checklist.",
                ),
            ],
            [
                (
                    "Analytics Dashboard",
                    14,
                    "Progress and feature completion of the analytics dashboard.",
                ),
                (
                    "Performance Testing",
                    31,
                    "Load testing and remaining performance issues.",
                ),
                (
                    "Launch Timeline",
                    49,
                    "Final QA and the Friday deployment target.",
                ),
            ],
            [
                (
                    "Fix remaining load testing issues",
                    "David Miller",
                    False,
                ),
                (
                    "Complete final QA",
                    "Sarah Chen",
                    False,
                ),
                (
                    "Prepare release checklist",
                    "Sarah Chen",
                    False,
                ),
            ],
        )

        add_meeting(
            db,
            "Q3 Marketing Strategy",
            now - timedelta(days=5),
            3180,
            (
                "The marketing team reviewed Q3 acquisition performance "
                "and planned upcoming campaigns, content initiatives and "
                "conversion experiments."
            ),
            [
                ("Emma Wilson", "emma@example.com"),
                ("Ryan Patel", "ryan@example.com"),
                ("Maya Singh", "maya@example.com"),
            ],
            [
                (
                    "Emma Wilson",
                    0,
                    18,
                    "Let's start by reviewing our acquisition numbers from the last quarter.",
                ),
                (
                    "Ryan Patel",
                    18,
                    38,
                    "Organic traffic grew strongly, but paid acquisition costs increased.",
                ),
                (
                    "Maya Singh",
                    38,
                    57,
                    "The product comparison content performed particularly well in search.",
                ),
                (
                    "Emma Wilson",
                    57,
                    77,
                    "For Q3 I'd like us to invest more heavily in high-intent content.",
                ),
                (
                    "Ryan Patel",
                    77,
                    98,
                    "I'll also run landing-page experiments to improve paid campaign conversion.",
                ),
                (
                    "Maya Singh",
                    98,
                    116,
                    "I'll prepare the new content calendar and keyword priorities.",
                ),
            ],
            [
                (
                    "Acquisition Performance",
                    0,
                    "Review of organic and paid acquisition performance.",
                ),
                (
                    "Content Strategy",
                    38,
                    "Content opportunities and search performance.",
                ),
                (
                    "Conversion Optimisation",
                    77,
                    "Landing-page and campaign experiments.",
                ),
            ],
            [
                (
                    "Prepare Q3 content calendar",
                    "Maya Singh",
                    False,
                ),
                (
                    "Launch landing-page experiments",
                    "Ryan Patel",
                    False,
                ),
                (
                    "Finalise Q3 campaign priorities",
                    "Emma Wilson",
                    True,
                ),
            ],
        )

        add_meeting(
            db,
            "Engineering Architecture Review",
            now - timedelta(days=9),
            4020,
            (
                "Engineering reviewed API scalability, database performance "
                "and caching options ahead of the next phase of platform growth."
            ),
            [
                ("Daniel Kim", "daniel@example.com"),
                ("Priya Shah", "priya@example.com"),
                ("Michael Lee", "michael@example.com"),
                ("Nina Rao", "nina@example.com"),
            ],
            [
                (
                    "Daniel Kim",
                    0,
                    17,
                    "Today's main topic is how the API behaves as traffic increases.",
                ),
                (
                    "Priya Shah",
                    17,
                    39,
                    "Most endpoints scale well, but the reporting queries are becoming expensive.",
                ),
                (
                    "Michael Lee",
                    39,
                    61,
                    "We can reduce repeated database work by caching common report queries.",
                ),
                (
                    "Nina Rao",
                    61,
                    82,
                    "We should add database indexes before introducing another infrastructure layer.",
                ),
                (
                    "Daniel Kim",
                    82,
                    103,
                    "Let's benchmark both changes and compare latency before making the decision.",
                ),
                (
                    "Priya Shah",
                    103,
                    125,
                    "I'll prepare a load-test scenario that represents production traffic.",
                ),
            ],
            [
                (
                    "API Scalability",
                    0,
                    "Expected API behaviour under increased traffic.",
                ),
                (
                    "Database Performance",
                    17,
                    "Reporting queries, indexing and query performance.",
                ),
                (
                    "Caching",
                    39,
                    "Potential caching strategy for frequently requested data.",
                ),
            ],
            [
                (
                    "Benchmark database indexes",
                    "Nina Rao",
                    False,
                ),
                (
                    "Prepare production load test",
                    "Priya Shah",
                    False,
                ),
                (
                    "Prototype report caching",
                    "Michael Lee",
                    False,
                ),
            ],
        )

        add_meeting(
            db,
            "Customer Success Review",
            now - timedelta(days=14),
            2880,
            (
                "The customer success team reviewed recent customer "
                "feedback, onboarding friction and opportunities to "
                "improve retention."
            ),
            [
                ("Olivia Brown", "olivia@example.com"),
                ("James Taylor", "james@example.com"),
                ("Sophia Martinez", "sophia@example.com"),
            ],
            [
                (
                    "Olivia Brown",
                    0,
                    20,
                    "Let's review the themes we're seeing in customer feedback this month.",
                ),
                (
                    "James Taylor",
                    20,
                    41,
                    "The strongest positive feedback is around the new analytics workflow.",
                ),
                (
                    "Sophia Martinez",
                    41,
                    62,
                    "The biggest friction point is still initial workspace configuration.",
                ),
                (
                    "Olivia Brown",
                    62,
                    83,
                    "We should simplify onboarding before adding more steps to the product tour.",
                ),
                (
                    "James Taylor",
                    83,
                    104,
                    "I'll identify the accounts that dropped during the first week.",
                ),
                (
                    "Sophia Martinez",
                    104,
                    126,
                    "I'll draft a shorter onboarding checklist based on the support tickets.",
                ),
            ],
            [
                (
                    "Customer Feedback",
                    0,
                    "Major themes from recent customer feedback.",
                ),
                (
                    "Onboarding",
                    41,
                    "Workspace setup and onboarding friction.",
                ),
                (
                    "Retention",
                    83,
                    "Early customer drop-off and retention opportunities.",
                ),
            ],
            [
                (
                    "Analyse first-week customer drop-off",
                    "James Taylor",
                    False,
                ),
                (
                    "Draft simplified onboarding checklist",
                    "Sophia Martinez",
                    False,
                ),
                (
                    "Review onboarding improvements",
                    "Olivia Brown",
                    False,
                ),
            ],
        )

        db.commit()
        print("Demo data seeded successfully.")

    except Exception as error:
        db.rollback()
        print(f"Failed to seed database: {error}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()