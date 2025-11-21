import { InterviewRoomPage } from "../../../components/pages/InterviewRoomPage";

export default function InterviewRoomWithId({
  params,
}: {
  params: { id: string };
}) {
  return <InterviewRoomPage sessionId={params.id} />;
}
