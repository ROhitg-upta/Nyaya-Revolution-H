import { ChatInterface } from "@/components/ai";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatInterface conversationId={id} />;
}
