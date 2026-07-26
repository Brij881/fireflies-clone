from pydantic import BaseModel, ConfigDict


class TopicCreate(BaseModel):
    title: str
    start_time: float
    description: str | None = None


class TopicResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    start_time: float
    description: str | None

    model_config = ConfigDict(from_attributes=True)