CREATE TABLE `callsHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` varchar(255) NOT NULL,
	`viewerId` int NOT NULL,
	`streamerId` int NOT NULL,
	`startedAt` timestamp NOT NULL,
	`endedAt` timestamp,
	`durationMinutes` int DEFAULT 0,
	`totalCost` int DEFAULT 0,
	`status` enum('active','completed','cancelled') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `callsHistory_id` PRIMARY KEY(`id`),
	CONSTRAINT `callsHistory_roomId_unique` UNIQUE(`roomId`)
);
--> statement-breakpoint
CREATE TABLE `profileTags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`tagId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profileTags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userType` enum('streamer','viewer') NOT NULL,
	`bio` text,
	`photoUrl` text,
	`pricePerMinute` int DEFAULT 199,
	`isOnline` boolean DEFAULT false,
	`balance` int DEFAULT 0,
	`totalEarnings` int DEFAULT 0,
	`kycStatus` enum('pending','approved','rejected') DEFAULT 'pending',
	`kycDocumentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('credit','debit','withdrawal','call_charge','call_earning') NOT NULL,
	`amount` int NOT NULL,
	`callId` int,
	`description` text,
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','streamer','viewer') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `callsHistory` ADD CONSTRAINT `callsHistory_viewerId_users_id_fk` FOREIGN KEY (`viewerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callsHistory` ADD CONSTRAINT `callsHistory_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profileTags` ADD CONSTRAINT `profileTags_profileId_profiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profileTags` ADD CONSTRAINT `profileTags_tagId_tags_id_fk` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_callId_callsHistory_id_fk` FOREIGN KEY (`callId`) REFERENCES `callsHistory`(`id`) ON DELETE no action ON UPDATE no action;