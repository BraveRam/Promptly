import { Context } from "grammy";

export type Message = {
    role: 'user' | 'assistant';
    content: string;
}

export type Messages = Message[];

export type SessionData = {
    convMessages: Messages;
    messages: number[];
}

export type MyContext = Context & { session: SessionData };