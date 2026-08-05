CREATE TABLE `app_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name` text NOT NULL,
	`number` text DEFAULT '' NOT NULL,
	`file_key` text,
	`file_name` text,
	`file_type` text,
	`created_at` text NOT NULL
);
