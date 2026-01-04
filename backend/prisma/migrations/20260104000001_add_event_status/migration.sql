-- Prisma migration: add status column to Event
-- Note: Run `npx prisma migrate deploy` or `npx prisma migrate dev` locally to apply.

ALTER TABLE `Event`
  ADD COLUMN `status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING';
