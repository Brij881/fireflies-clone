import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import MeetingDetailContent from "@/components/meeting-detail/MeetingDetailContent";
import MeetingHeader from "@/components/meeting-detail/MeetingHeader";
import {
  ApiError,
  getActionItems,
  getMeeting,
  getTopics,
  getTranscript,
} from "@/lib/api";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MeetingPage({ params }: Props) {
  const { id } = await params;
  const meetingId = Number(id);

  if (
    Number.isNaN(meetingId) ||
    meetingId <= 0
  ) {
    notFound();
  }

  try {
    const [meeting, transcript, actionItems, topics] =
      await Promise.all([
        getMeeting(meetingId),
        getTranscript(meetingId),
        getActionItems(meetingId),
        getTopics(meetingId),
      ]);

    return (
      <AppShell>
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
          <MeetingHeader meeting={meeting} />

          <MeetingDetailContent
            meeting={meeting}
            transcript={transcript}
            actionItems={actionItems}
            topics={topics}
          />
        </div>
      </AppShell>
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      notFound();
    }

    throw error;
  }
}