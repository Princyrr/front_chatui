"use server";

export async function createConversation() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/conversation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Nova conversa" }),
    cache: "no-store",
  });
  return res.json();
}

export async function sendMessage(conversationId: string, text: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/conversation/${conversationId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    cache: "no-store",
  });
  return res.json();
}
