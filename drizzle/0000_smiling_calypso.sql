CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" integer,
	"username" text,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT now()
);
