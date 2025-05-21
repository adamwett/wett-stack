PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_agent` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`model` text DEFAULT 'meta-llama/llama-3.2-3b-instruct:free' NOT NULL,
	`system_prompt` text DEFAULT 'You are a helpful assistant.' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_agent`("id", "name", "description", "model", "system_prompt") SELECT "id", "name", "description", "model", "system_prompt" FROM `agent`;--> statement-breakpoint
DROP TABLE `agent`;--> statement-breakpoint
ALTER TABLE `__new_agent` RENAME TO `agent`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_models` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`input_cost` integer NOT NULL,
	`output_cost` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_models`("id", "name", "description", "input_cost", "output_cost", "created_at", "updated_at") SELECT "id", "name", "description", "input_cost", "output_cost", "created_at", "updated_at" FROM `models`;--> statement-breakpoint
DROP TABLE `models`;--> statement-breakpoint
ALTER TABLE `__new_models` RENAME TO `models`;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`thread_id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "thread_id", "role", "content", "created_at", "updated_at") SELECT "id", "thread_id", "role", "content", "created_at", "updated_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
CREATE TABLE `__new_threads` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'New Thread' NOT NULL,
	`system_prompt` text NOT NULL,
	`model` text DEFAULT 'meta-llama/llama-3.2-3b-instruct:free' NOT NULL,
	`input_tokens` integer DEFAULT 0 NOT NULL,
	`output_tokens` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_threads`("id", "name", "system_prompt", "model", "input_tokens", "output_tokens", "created_at", "updated_at") SELECT "id", "name", "system_prompt", "model", "input_tokens", "output_tokens", "created_at", "updated_at" FROM `threads`;--> statement-breakpoint
DROP TABLE `threads`;--> statement-breakpoint
ALTER TABLE `__new_threads` RENAME TO `threads`;