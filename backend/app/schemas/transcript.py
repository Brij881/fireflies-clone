from pydantic import BaseModel, ConfigDict


class TranscriptSegmentCreate(BaseModel):
    speaker: str
    start_time: float
    end_time: float
    text: str
    segment_order: int


class TranscriptSegmentResponse(BaseModel):
    id: int
    meeting_id: int
    speaker: str
    start_time: float
    end_time: float
    text: str
    segment_order: int

    model_config = ConfigDict(from_attributes=True)