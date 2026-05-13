-- Extend media_items.type for LinkedIn / X gallery entries (idempotent if already applied).

ALTER TABLE media_items
MODIFY COLUMN type ENUM('youtube', 'youtubeShort', 'photo', 'videoFile', 'socialPost') NOT NULL;
