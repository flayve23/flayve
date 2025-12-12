CREATE TABLE `streamer_commissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamerId` int NOT NULL,
	`baseCommission` decimal(5,2) NOT NULL DEFAULT '70.00',
	`loyaltyBonus` decimal(5,2) DEFAULT '0.00',
	`referralBonus` decimal(10,2) DEFAULT '0.00',
	`performanceBonus` decimal(10,2) DEFAULT '0.00',
	`totalCommission` decimal(5,2) NOT NULL DEFAULT '70.00',
	`notes` text,
	`effectiveDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `streamer_commissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `streamer_commissions_streamerId_unique` UNIQUE(`streamerId`)
);
--> statement-breakpoint
ALTER TABLE `streamer_commissions` ADD CONSTRAINT `streamer_commissions_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;