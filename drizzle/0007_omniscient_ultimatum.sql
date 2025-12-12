CREATE TABLE `callNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamerId` int NOT NULL,
	`viewerId` int NOT NULL,
	`status` enum('pending','accepted','rejected','expired') DEFAULT 'pending',
	`viewerName` varchar(255),
	`viewerPhotoUrl` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `callNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `callRooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` varchar(255) NOT NULL,
	`streamerId` int NOT NULL,
	`viewerId` int NOT NULL,
	`status` enum('waiting','active','ended') DEFAULT 'waiting',
	`startedAt` timestamp,
	`endedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `callRooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `callRooms_roomId_unique` UNIQUE(`roomId`)
);
--> statement-breakpoint
CREATE TABLE `streamerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bio` text,
	`about` text,
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `streamerProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `streamerProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `callNotifications` ADD CONSTRAINT `callNotifications_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callNotifications` ADD CONSTRAINT `callNotifications_viewerId_users_id_fk` FOREIGN KEY (`viewerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callRooms` ADD CONSTRAINT `callRooms_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callRooms` ADD CONSTRAINT `callRooms_viewerId_users_id_fk` FOREIGN KEY (`viewerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `streamerProfiles` ADD CONSTRAINT `streamerProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;