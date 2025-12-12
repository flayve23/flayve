ALTER TABLE `profiles` ADD `isPremium` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `profiles` ADD `isFamous` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `profiles` ADD `famousName` varchar(255);--> statement-breakpoint
ALTER TABLE `profiles` ADD `famousVerificationUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `profiles` ADD `premiumTier` enum('standard','gold','platinum') DEFAULT 'standard';