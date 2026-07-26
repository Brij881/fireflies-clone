from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title = Column(String(255), nullable=False)

    start_time = Column(
        Float,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    meeting = relationship(
        "Meeting",
        back_populates="topics"
    )