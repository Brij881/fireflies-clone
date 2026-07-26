export interface Participant {
  id: number;
  name: string;
  email: string | null;
}

export interface Meeting {
  id: number;
  title: string;
  meeting_date: string;
  duration: number;
  summary: string | null;
  created_at: string;
  updated_at: string;
  participants: Participant[];
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker: string;
  start_time: number;
  end_time: number;
  text: string;
  segment_order: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  description: string;
  assignee: string | null;
  completed: boolean;
}

export interface Topic {
  id: number;
  meeting_id: number;
  title: string;
  start_time: number;
  description: string | null;
}