CREATE TABLE `callReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`callId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`revieweeId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `callReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('call_incoming','call_accepted','call_rejected','call_ended','new_review','account_warning','account_suspended','account_banned','balance_low','payment_received','promotion','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`data` json,
	`isRead` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streamerBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamerId` int NOT NULL,
	`badgeType` enum('verified','new','top_rated','top_earner','most_active','trusted','premium','vip') NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`reason` text,
	CONSTRAINT `streamerBadges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `callReviews` ADD CONSTRAINT `callReviews_callId_activeCalls_id_fk` FOREIGN KEY (`callId`) REFERENCES `activeCalls`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callReviews` ADD CONSTRAINT `callReviews_reviewerId_users_id_fk` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callReviews` ADD CONSTRAINT `callReviews_revieweeId_users_id_fk` FOREIGN KEY (`revieweeId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `streamerBadges` ADD CONSTRAINT `streamerBadges_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;