-- Add Feedback table for student feedback on events

CREATE TABLE `Feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `eventId` INT NOT NULL,
  `rating` INT NOT NULL,
  `comment` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `Feedback_userId_eventId_key` (`userId`, `eventId`),
  CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Feedback_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
