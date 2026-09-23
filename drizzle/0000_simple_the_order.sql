CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`business` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`industry` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`current_leads` integer,
	`target_leads` integer,
	`challenge` text NOT NULL,
	`consent` integer NOT NULL,
	`privacy_version` text NOT NULL,
	`ip_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_leads_ip_created` ON `leads` (`ip_hash`,`created_at`);