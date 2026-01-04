-- Add isBlocked to User
ALTER TABLE `User` ADD COLUMN `isBlocked` TINYINT(1) NOT NULL DEFAULT 0;

-- Create Attendance table
CREATE TABLE `Attendance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `eventId` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'ABSENT',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Attendance_user_event_unique` (`userId`,`eventId`),
  CONSTRAINT `Attendance_user_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Attendance_event_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Notification table
CREATE TABLE `Notification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `message` LONGTEXT NOT NULL,
  `eventId` INT NULL,
  `targetAll` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Notification_event_idx` (`eventId`),
  CONSTRAINT `Notification_event_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create CertificateTemplate table
CREATE TABLE `CertificateTemplate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fileUrl` VARCHAR(1024) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `uploadedBy` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `CertificateTemplate_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
