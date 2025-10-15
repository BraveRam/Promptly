import { Bot, session, webhookCallback } from "grammy";
import dotenv from "dotenv";
import { getResponse } from "./services/ai.js";
import { type MyContext, type SessionData } from "./types/types.js";
import { users } from "./schema/schema.js";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { env } from "./config/env.js";
import { escapeMarkdownV2, splitText } from "./utils/utils.js";

dotenv.config();

const bot = new Bot<MyContext>(env.BOT_TOKEN!);


const initialConversation = (): SessionData => ({
  convMessages: [
    
  ],
  messages: []
});

bot.use(session({ initial: initialConversation }));

bot.command("start", async (ctx) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.telegram_id, String(ctx.chat.id)));

  if (existingUser.length === 0) {
    await db.insert(users).values({
      telegram_id: String(ctx.chat.id),
      username: ctx.chat.username,
      first_name: ctx.chat.first_name,
      last_name: ctx.chat.last_name,
    });

    await bot.api.sendMessage(
      ctx.chat.id,
      `🚀 Hello, ${ctx.chat.first_name || "there"}!\n\nWelcome to Promptly! 🎨✨\n\nSend me any text or idea, and I'll supercharge it into the perfect prompt to get the best results from an AI model. 💡💬\n\nLet's turn your simple thoughts into AI magic! 🪄`
    );
  } else {
    await bot.api.sendMessage(
      ctx.chat.id,
      "💬 Got a text or idea? Send it over, and I'll turn it into a next-level prompt! ⚡"
    );
  }
});


bot.command("newchat", async (ctx) => {
  ctx.session.convMessages = [
  ];
  await ctx.reply("🆕 Started a new conversation.");
});

bot.command("messages", async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.session.convMessages));
});

bot.on("message", async (ctx) => {
  if (ctx.session.convMessages.length >= 100) {
    await ctx.reply(
      "<i>⚠️Too many messages. Please clear the conversation - hit /newchat.</i>",
      {
        parse_mode: "HTML",
      }
    );
    return;
  }

  const now = Date.now();
  const oneMinuteAgo = now - 60_000;

  ctx.session.messages = ctx.session.messages.filter(
    (timestamp) => timestamp > oneMinuteAgo
  );

  if (ctx.session.messages.length >= 2) {
    await ctx.reply(
      "<i>⏳ You can only send 5 messages per minute. Please wait.</i>",
      {
        parse_mode: "HTML",
      }
    );
    return;
  }

  ctx.session.messages.push(now);

  ctx.replyWithChatAction("typing");
  ctx.session.convMessages.push({
    role: "user",
    content: ctx.message.text as string,
  });

  const responses = await getResponse(ctx.session.convMessages);
  const responseChunks = splitText(responses as string);
  for (const response of responseChunks) {
    ctx.session.convMessages.push({ role: "assistant", content: response });
    let something = escapeMarkdownV2(response);
    await ctx.reply(`${something}`, {
      parse_mode: "MarkdownV2",
    });
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(err);
  ctx.reply("An error occurred while processing your request - try again later.");
  console.error(`Error while handling update ${ctx.update.update_id}:`);
});

console.log("The bot is starting....");
// bot.start({
//   drop_pending_updates: true
// });

export default webhookCallback(bot, "https");