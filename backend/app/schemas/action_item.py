from pydantic import BaseModel, ConfigDict


class ActionItemCreate(BaseModel):
    description: str
    assignee: str | None = None


class ActionItemUpdate(BaseModel):
    description: str | None = None
    assignee: str | None = None
    completed: bool | None = None


class ActionItemResponse(BaseModel):
    id: int
    meeting_id: int
    description: str
    assignee: str | None
    completed: bool

    model_config = ConfigDict(from_attributes=True)