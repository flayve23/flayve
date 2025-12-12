ALTER TABLE `withdrawals` ADD `fee` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD `netAmount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD `isAnticipated` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD `earningDate` timestamp;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD `availableDate` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD `ipAddress` varchar(45);--> statement-breakpoint
ALTER TABLE `withdrawals` ADD `userAgent` text;