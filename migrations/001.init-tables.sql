CREATE TABLE `Patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) DEFAULT (UUID()),
  `username` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Patient_Unique_ID` (`id`),
  UNIQUE KEY `Patient_Unique_Username` (`username`) USING HASH,
  UNIQUE KEY `Patient_Unique_Email` (`email`) USING HASH
);


CREATE TABLE `Physician` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) NOT NULL DEFAULT (UUID()),
  `username` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profile_image_url` text DEFAULT NULL,
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Physician_Unique_ID` (`id`),
  UNIQUE KEY `Physician_Unique_Username` (`username`) USING HASH,
  UNIQUE KEY `Physician_Unique_Email` (`email`) USING HASH
);


CREATE TABLE `Radiologist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) NOT NULL DEFAULT (UUID()),
  `username` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profile_image_url` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `expertise` text DEFAULT NULL,
  `years_of_exp` text DEFAULT NULL,
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Radiologist_Unique_ID` (`id`),
  UNIQUE KEY `Radiologist_Unique_Username` (`username`) USING HASH,
  UNIQUE KEY `Radiologist_Unique_Email` (`email`) USING HASH
);


CREATE TABLE `Image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) NOT NULL DEFAULT (UUID()),
  `uploaded_by` varchar(36) NOT NULL,
  `url_string` text NOT NULL,
  `notes` text DEFAULT NULL,
  `diagnoses` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Image_Unique_ID` (`id`),
  KEY `Image_FK2` (`uploaded_by`),
  CONSTRAINT `Image_FK1` FOREIGN KEY (`uploaded_by`) REFERENCES `Radiologist` (`unique_id`),
  CONSTRAINT `Image_FK2` FOREIGN KEY (`uploaded_by`) REFERENCES `Physician` (`unique_id`)
);

/*
CREATE TABLE `Image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) NOT NULL DEFAULT (UUID()),
  `uploaded_by` varchar(36) NOT NULL,
  `for_patient_id` varchar(36) NOT NULL,
  `url_string` text NOT NULL,
  `notes` text DEFAULT NULL,
  `diagnoses` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Image_Unique_ID` (`id`),
  KEY `Image_by_idx` (`uploaded_by`),
  KEY `Image_for_pateitn_idx` (`for_patient_id`)
);
*/


CREATE TABLE `Notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) NOT NULL DEFAULT (UUID()),
  `read` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Notification_Unique_ID` (`id`),
  CONSTRAINT `Notification_FK1` FOREIGN KEY (`unique_id`) REFERENCES `Patient` (`unique_id`),
  CONSTRAINT `Notification_FK2` FOREIGN KEY (`unique_id`) REFERENCES `Radiologist` (`unique_id`),
  CONSTRAINT `Notification_FK3` FOREIGN KEY (`unique_id`) REFERENCES `Image` (`unique_id`)
);

/*
CREATE TABLE `Notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(36) NOT NULL DEFAULT (UUID()),
  `patient_id` varchar(36) NOT NULL,
  `radiologist_id` varchar(36) NOT NULL,
  `image_id` varchar(36) NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`unique_id`),
  UNIQUE KEY `Notification_Unique_ID` (`id`),
  KEY patient_id_idx (patient_id),
  KEY radiologist_id_idx (radiologist_id),
  KEY image_id_idx (image_id)
);
*/
