ALTER TABLE `users` ADD `emailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationToken` text;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationTokenExpiry` timestamp;