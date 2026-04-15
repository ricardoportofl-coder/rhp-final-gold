import type { Env, WhatsAppWebhookBody, ChatMessage } from "./types";
import { sendMessage, markAsRead } from "./whatsapp";
import { getChatResponse } from "./openai";

// Keep last N message pairs in memory to provide conversation context
const MAX_HISTORY_MESSAGES = 10;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── Webhook verification (Meta sends GET to confirm the endpoint) ──
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }
      return new Response("Forbidden", { status: 403 });
    }

    // ── Incoming messages (Meta sends POST for every new message) ──
    if (request.method === "POST" && url.pathname === "/webhook") {
      let body: WhatsAppWebhookBody;
      try {
        body = await request.json() as WhatsAppWebhookBody;
      } catch {
        return new Response("Bad Request", { status: 400 });
      }

      // Meta requires a fast 200 OK — process async
      const ctx = { waitUntil: (p: Promise<unknown>) => p } as ExecutionContext;
      ctx.waitUntil(handleMessages(body, env));

      return new Response("OK", { status: 200 });
    }

    // ── Health check ──
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok", service: "gabriele-bot" });
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleMessages(body: WhatsAppWebhookBody, env: Env): Promise<void> {
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value.messages?.length) continue;

      for (const message of value.messages) {
        // Only handle text messages for now
        if (message.type !== "text" || !message.text?.body) continue;

        const from = message.from;
        const userText = message.text.body;
        const messageId = message.id;

        // Fire-and-forget: mark message as read
        markAsRead(env.WHATSAPP_PHONE_NUMBER_ID, env.WHATSAPP_TOKEN, messageId).catch(
          () => void 0
        );

        try {
          // Load conversation history from KV
          const historyRaw = await env.CONVERSATION_KV.get(`history:${from}`);
          const history: ChatMessage[] = historyRaw ? JSON.parse(historyRaw) : [];

          // Get AI reply
          const aiReply = await getChatResponse(env.OPENAI_API_KEY, history, userText);

          // Persist updated history (trim to avoid bloat)
          const updatedHistory: ChatMessage[] = [
            ...history,
            { role: "user", content: userText },
            { role: "assistant", content: aiReply },
          ].slice(-MAX_HISTORY_MESSAGES);

          await env.CONVERSATION_KV.put(
            `history:${from}`,
            JSON.stringify(updatedHistory),
            { expirationTtl: 86400 } // 24 hours
          );

          // Send reply back to user
          await sendMessage(env.WHATSAPP_PHONE_NUMBER_ID, env.WHATSAPP_TOKEN, from, aiReply);
        } catch (err) {
          console.error(`Error processing message from ${from}:`, err);
          // Send a graceful fallback so the user isn't left in silence
          await sendMessage(
            env.WHATSAPP_PHONE_NUMBER_ID,
            env.WHATSAPP_TOKEN,
            from,
            "I'm sorry, I ran into a brief issue. Please try again in a moment, or call us directly at +1 (305) 922-7181."
          ).catch(() => void 0);
        }
      }
    }
  }
}
