CREATE TABLE `kycApprovals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamerId` int NOT NULL,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`approvedBy` int,
	`comment` text,
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kycApprovals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `withdrawals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamerId` int NOT NULL,
	`amount` int NOT NULL,
	`pixKey` varchar(255) NOT NULL,
	`pixKeyType` enum('cpf','email','phone') NOT NULL,
	`status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`description` text,
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `withdrawals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD `withdrawalId` int;--> statement-breakpoint
ALTER TABLE `kycApprovals` ADD CONSTRAINT `kycApprovals_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kycApprovals` ADD CONSTRAINT `kycApprovals_approvedBy_users_id_fk` FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD CONSTRAINT `withdrawals_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_withdrawalId_withdrawals_id_fk` FOREIGN KEY (`withdrawalId`) REFERENCES `withdrawals`(`id`) ON DELETE no action ON UPDATE no action;