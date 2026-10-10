-- Maanak Drishti - Digital Legal Metrology
-- MySQL 8.0+ Database Schema Definition
-- Legal Metrology (Packaged Commodities) Rules, 2011 Compliance System

CREATE DATABASE IF NOT EXISTS `maanak_drishti` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `maanak_drishti`;

-- 1. Consumer Grievance & Packaging Reports Table
CREATE TABLE IF NOT EXISTS `consumer_reports` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_name` VARCHAR(255) NOT NULL,
  `manufacturer` VARCHAR(500) NULL DEFAULT 'Not declared',
  `mrp` VARCHAR(100) NULL DEFAULT 'Not declared',
  `net_quantity` VARCHAR(100) NULL DEFAULT 'Not declared',
  `mfg_date` VARCHAR(100) NULL DEFAULT 'Not declared',
  `consumer_care` VARCHAR(500) NULL DEFAULT 'Not declared',
  `reason` VARCHAR(255) NOT NULL,
  `reason_category` VARCHAR(100) NOT NULL DEFAULT 'packaging_declaration',
  `description` TEXT NOT NULL,
  `image_url` LONGTEXT NULL,
  `extracted_details` JSON NULL,
  `compliance_findings` JSON NULL,
  `consumer_name` VARCHAR(255) NULL DEFAULT 'Anonymous Consumer',
  `consumer_email` VARCHAR(255) NULL DEFAULT '',
  `consumer_phone` VARCHAR(50) NULL DEFAULT '',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
  `priority` VARCHAR(20) NOT NULL DEFAULT 'Medium',
  `investigation_notes` TEXT NULL,
  `rejection_reason` TEXT NULL,
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Inspector Audit Trail Table
CREATE TABLE IF NOT EXISTS `inspector_audits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` VARCHAR(64) NOT NULL,
  `inspector_id` VARCHAR(100) NOT NULL DEFAULT 'OFFICER-INSPECTOR',
  `action` VARCHAR(100) NOT NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`report_id`) REFERENCES `consumer_reports`(`id`) ON DELETE CASCADE,
  INDEX `idx_report_id` (`report_id`),
  INDEX `idx_inspector_id` (`inspector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
