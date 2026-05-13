CREATE TABLE IF NOT EXISTS media_items (
  id VARCHAR(100) NOT NULL PRIMARY KEY,
  type ENUM('youtube', 'youtubeShort', 'photo', 'videoFile') NOT NULL,
  title VARCHAR(300) NOT NULL,
  thumbnail_url TEXT NULL,
  url TEXT NULL,
  video_id VARCHAR(32) NULL,
  source VARCHAR(140) NULL,
  date_label VARCHAR(90) NULL,
  article_content TEXT NOT NULL,
  short_description VARCHAR(320) NULL,
  description_purpose TEXT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
