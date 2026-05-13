-- Optional JSON array of image URLs for one published title (2–3+ photos).
-- First URL remains in thumbnail_url / url for backward compatibility.

ALTER TABLE media_items
ADD COLUMN photo_urls_json TEXT NULL
AFTER url;
