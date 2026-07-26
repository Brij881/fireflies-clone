from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

class ParticipantCreate(BaseModel):
    name: str
    email: str | None = None


class ParticipantResponse(BaseModel):
    id: int
    name: str
    email: str | None = None

    model_config = ConfigDict(from_attributes=True)


class MeetingCreate(BaseModel):
    title: str
    meeting_date: datetime
    duration: float = 0
    summary: str | None = None
    participants: list[ParticipantCreate] = Field(default_factory=list)


class MeetingUpdate(BaseModel):
    title: str | None = None
    meeting_date: datetime | None = None
    duration: float | None = None
    summary: str | None = None
    participants: list[ParticipantCreate] | None = None


class MeetingResponse(BaseModel):
    id: int
    title: str
    meeting_date: datetime
    duration: float
    summary: str | None
    created_at: datetime
    updated_at: datetime
    participants: list[ParticipantResponse]

    model_config = ConfigDict(from_attributes=True)