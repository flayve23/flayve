CREATE TABLE `balanceRecharges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`preferenceId` varchar(255),
	`paymentId` varchar(255),
	`paymentMethod` enum('pix','credit_card','debit_card'),
	`status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `balanceRecharges_id` PRIMARY KEY(`id`),
	CONSTRAINT `balanceRecharges_preferenceId_unique` UNIQUE(`preferenceId`),
	CONSTRAINT `balanceRecharges_paymentId_unique` UNIQUE(`paymentId`)
);
--> statement-breakpoint
CREATE TABLE `mpWithdrawals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamerId` int NOT NULL,
	`amount` int NOT NULL,
	`transferId` varchar(255),
	`pixKey` varchar(255) NOT NULL,
	`pixKeyType` enum('cpf','email','phone','random') NOT NULL,
	`status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`description` text,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mpWithdrawals_id` PRIMARY KEY(`id`),
	CONSTRAINT `mpWithdrawals_transferId_unique` UNIQUE(`transferId`)
);
--> statement-breakpoint
ALTER TABLE `balanceRecharges` ADD CONSTRAINT `balanceRecharges_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mpWithdrawals` ADD CONSTRAINT `mpWithdrawals_streamerId_users_id_fk` FOREIGN KEY (`streamerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;