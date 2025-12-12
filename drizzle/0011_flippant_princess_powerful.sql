CREATE TABLE `activeCalls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`callRoomId` varchar(255) NOT NULL,
	`streamerId` int NOT NULL,
	`viewerId` int NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `activeCalls_id` PRIMARY KEY(`id`),
	CONSTRAINT `activeCalls_callRoomId_unique` UNIQUE(`callRoomId`)
);
--> statement-breakpoint
CREATE TABLE `moderationLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`targetUserId` int NOT NULL,
	`action` enum('ban','unban','suspend','unsuspend','warn','end_call','remove_content','restrict_streaming','other') NOT NULL,
	`reason` text,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moderationLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderationWarnings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adminId` int NOT NULL,
	`reason` text NOT NULL,
	`warningCount` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moderationWarnings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adminId` int NOT NULL,
	`reason` text NOT NULL,
	`banType` enum('permanent','temporary') NOT NULL,
	`expiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userBans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userSuspensions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adminId` int NOT NULL,
	`reason` text NOT NULL,
	`suspensionDays` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userSuspensions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `activeCalls` ADD CONSTRAINT `activeCalls_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activeCalls` ADD CONSTRAINT `activeCalls_viewerId_users_id_fk` FOREIGN KEY (`viewerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moderationLogs` ADD CONSTRAINT `moderationLogs_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moderationLogs` ADD CONSTRAINT `moderationLogs_targetUserId_users_id_fk` FOREIGN KEY (`targetUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moderationWarnings` ADD CONSTRAINT `moderationWarnings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moderationWarnings` ADD CONSTRAINT `moderationWarnings_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userBans` ADD CONSTRAINT `userBans_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userBans` ADD CONSTRAINT `userBans_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userSuspensions` ADD CONSTRAINT `userSuspensions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userSuspensions` ADD CONSTRAINT `userSuspensions_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;