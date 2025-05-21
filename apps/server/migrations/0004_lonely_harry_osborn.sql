PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_threads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'New Thread' NOT NULL,
	`system_prompt` text NOT NULL,
	`model` text DEFAULT 'google/gemini-2.0-flash-exp:free' NOT NULL,
	`input_tokens` integer DEFAULT 0 NOT NULL,
	`output_tokens` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_threads`("id", "name", "system_prompt", "model", "input_tokens", "output_tokens", "created_at", "updated_at") SELECT "id", "name", "system_prompt", "model", "input_tokens", "output_tokens", "created_at", "updated_at" FROM `threads`;--> statement-breakpoint
DROP TABLE `threads`;--> statement-breakpoint
ALTER TABLE `__new_threads` RENAME TO `threads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;