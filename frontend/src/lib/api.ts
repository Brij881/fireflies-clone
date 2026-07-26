import {
  ActionItem,
  Meeting,
  Topic,
  TranscriptSegment,
} from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      }
    } catch {}

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getMeetings(): Promise<Meeting[]> {
  return request<Meeting[]>("/api/meetings");
}

export function getMeeting(id: number): Promise<Meeting> {
  return request<Meeting>(`/api/meetings/${id}`);
}

export function getTranscript(
  meetingId: number
): Promise<TranscriptSegment[]> {
  return request<TranscriptSegment[]>(
    `/api/meetings/${meetingId}/transcript`
  );
}

export function getActionItems(
  meetingId: number
): Promise<ActionItem[]> {
  return request<ActionItem[]>(
    `/api/meetings/${meetingId}/action-items`
  );
}

export function getTopics(
  meetingId: number
): Promise<Topic[]> {
  return request<Topic[]>(
    `/api/meetings/${meetingId}/topics`
  );
}

export interface CreateMeetingPayload {
  title: string;
  meeting_date: string;
  duration: number;
  summary?: string;
  participants: {
    name: string;
    email?: string;
  }[];
}

export interface UpdateMeetingPayload {
  title?: string;
  meeting_date?: string;
  duration?: number;
  summary?: string;
  participants?: {
    name: string;
    email?: string;
  }[];
}

export function createMeeting(
  data: CreateMeetingPayload
): Promise<Meeting> {
  return request<Meeting>("/api/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMeeting(
  id: number,
  data: UpdateMeetingPayload
): Promise<Meeting> {
  return request<Meeting>(`/api/meetings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteMeeting(
  id: number
): Promise<void> {
  return request<void>(`/api/meetings/${id}`, {
    method: "DELETE",
  });
}

export interface CreateTranscriptSegment {
  speaker: string;
  start_time: number;
  end_time: number;
  text: string;
  segment_order: number;
}

export function createTranscript(
  meetingId: number,
  segments: CreateTranscriptSegment[]
): Promise<TranscriptSegment[]> {
  return request<TranscriptSegment[]>(
    `/api/meetings/${meetingId}/transcript`,
    {
      method: "POST",
      body: JSON.stringify(segments),
    }
  );
}

export interface CreateActionItemPayload {
  description: string;
  assignee?: string;
}

export interface UpdateActionItemPayload {
  description?: string;
  assignee?: string;
  completed?: boolean;
}

export function createActionItem(
  meetingId: number,
  data: CreateActionItemPayload
): Promise<ActionItem> {
  return request<ActionItem>(
    `/api/meetings/${meetingId}/action-items`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateActionItem(
  itemId: number,
  data: UpdateActionItemPayload
): Promise<ActionItem> {
  return request<ActionItem>(
    `/api/action-items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export function deleteActionItem(
  itemId: number
): Promise<void> {
  return request<void>(
    `/api/action-items/${itemId}`,
    {
      method: "DELETE",
    }
  );
}