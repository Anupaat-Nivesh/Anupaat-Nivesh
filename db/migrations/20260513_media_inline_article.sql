-- Longer on-site read for social posts (LinkedIn Pulse summaries, etc.).
-- Safe to skip if `api/services/mediaDb.mjs` ensureMediaSchema already added this column.
ALTER TABLE media_items
  ADD COLUMN inline_article_content TEXT NULL AFTER article_content;
