from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    speaker = Column(String(255), nullable=False)

    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)

    text = Column(Text, nullable=False)

    segment_order = Column(Integer, nullable=False)

    meeting = relationship(
        "Meeting",
        back_populates="transcript_segments"
    )