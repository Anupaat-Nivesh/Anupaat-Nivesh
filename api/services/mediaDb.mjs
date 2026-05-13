import mysql from 'mysql2/promise';

let pool;
let schemaReady = false;

function getDbConfig() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
    queueLimit: 0
  };
}

export function isMediaDbConfigured() {
  return Boolean(
    process.env.DB_HOST &&
      process.env.DB_NAME &&
      process.env.DB_USER &&
      typeof process.env.DB_PASSWORD === 'string'
  );
}

function parsePhotoUrlsJson(raw) {
  if (raw == null) return null;
  const str = typeof raw === 'string' ? raw : String(raw);
  if (!str.trim()) return null;
  try {
    const parsed = JSON.parse(str);
    if (!Array.isArray(parsed)) return null;
    const urls = parsed.map((u) => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
    return urls.length > 1 ? urls : null;
  } catch {
    return null;
  }
}

function toPublicItem(row) {
  const photoUrls = parsePhotoUrlsJson(row.photo_urls_json);
  const fullArticle = row.inline_article_content ? String(row.inline_article_content) : '';
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    thumbnail: row.thumbnail_url || '',
    url: row.url || '',
    videoId: row.video_id || '',
    source: row.source || '',
    date: row.date_label || '',
    articleContent: row.article_content || '',
    shortDescription: row.short_description || '',
    ...(photoUrls ? { photoUrls } : {}),
    ...(fullArticle ? { fullArticleContent: fullArticle } : {})
  };
}

export async function getMediaPool() {
  if (!isMediaDbConfigured()) {
    throw new Error('Media DB is not configured. Set DB_HOST/DB_NAME/DB_USER/DB_PASSWORD.');
  }
  if (!pool) {
    pool = mysql.createPool(getDbConfig());
  }
  return pool;
}

export async function ensureMediaSchema() {
  if (schemaReady) return;
  const p = await getMediaPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS media_items (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      type ENUM('youtube','youtubeShort','photo','videoFile','socialPost') NOT NULL,
      title VARCHAR(300) NOT NULL,
      thumbnail_url TEXT NULL,
      url TEXT NULL,
      photo_urls_json TEXT NULL,
      video_id VARCHAR(32) NULL,
      source VARCHAR(140) NULL,
      date_label VARCHAR(90) NULL,
      article_content TEXT NOT NULL,
      inline_article_content TEXT NULL,
      short_description VARCHAR(320) NULL,
      description_purpose TEXT NULL,
      status ENUM('draft','published') NOT NULL DEFAULT 'published',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [colRows] = await p.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'media_items'
       AND COLUMN_NAME = 'photo_urls_json'`
  );
  if (!colRows[0]?.c) {
    await p.query('ALTER TABLE media_items ADD COLUMN photo_urls_json TEXT NULL AFTER url');
  }

  const [typeRows] = await p.query(
    `SELECT COLUMN_TYPE AS t FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'media_items'
       AND COLUMN_NAME = 'type'`
  );
  const typeCol = String(typeRows[0]?.t || '').toLowerCase();
  if (typeCol && !typeCol.includes('socialpost')) {
    await p.query(
      `ALTER TABLE media_items MODIFY COLUMN type ENUM('youtube','youtubeShort','photo','videoFile','socialPost') NOT NULL`
    );
  }

  const [inlineRows] = await p.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'media_items'
       AND COLUMN_NAME = 'inline_article_content'`
  );
  if (!inlineRows[0]?.c) {
    await p.query(
      'ALTER TABLE media_items ADD COLUMN inline_article_content TEXT NULL AFTER article_content'
    );
  }

  schemaReady = true;
}

function makeId(prefix = 'media') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function listPublishedMedia() {
  await ensureMediaSchema();
  const p = await getMediaPool();
  const [rows] = await p.query(
    `SELECT * FROM media_items
     WHERE status='published'
     ORDER BY sort_order DESC, created_at DESC`
  );
  return rows.map(toPublicItem);
}

export async function listAllMediaAdmin() {
  await ensureMediaSchema();
  const p = await getMediaPool();
  const [rows] = await p.query(
    `SELECT * FROM media_items
     ORDER BY sort_order DESC, created_at DESC`
  );
  return rows.map((r) => ({
    ...toPublicItem(r),
    descriptionPurpose: r.description_purpose || '',
    status: r.status,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

function photoUrlsJsonForInsert(input) {
  if (Array.isArray(input.photoUrls) && input.photoUrls.length > 1) {
    return JSON.stringify(input.photoUrls);
  }
  return null;
}

export async function createMediaItem(input) {
  await ensureMediaSchema();
  const p = await getMediaPool();
  const id = input.id || makeId('media');
  const photoUrlsJson = photoUrlsJsonForInsert(input);

  await p.query(
    `INSERT INTO media_items
      (id, type, title, thumbnail_url, url, photo_urls_json, video_id, source, date_label, article_content, inline_article_content, short_description, description_purpose, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.type,
      input.title,
      input.thumbnail || null,
      input.url || null,
      photoUrlsJson,
      input.videoId || null,
      input.source || null,
      input.date || null,
      input.articleContent || '',
      input.inlineArticleContent || input.fullArticleContent || null,
      input.shortDescription || null,
      input.descriptionPurpose || null,
      input.status || 'published',
      Number(input.sortOrder || 0)
    ]
  );

  return { ...input, id };
}

export async function updateMediaItem(id, patch) {
  await ensureMediaSchema();
  const p = await getMediaPool();
  await p.query(
    `UPDATE media_items
     SET
       type = COALESCE(?, type),
       title = COALESCE(?, title),
       thumbnail_url = COALESCE(?, thumbnail_url),
       url = COALESCE(?, url),
       video_id = COALESCE(?, video_id),
       source = COALESCE(?, source),
       date_label = COALESCE(?, date_label),
       article_content = COALESCE(?, article_content),
       short_description = COALESCE(?, short_description),
       description_purpose = COALESCE(?, description_purpose),
       status = COALESCE(?, status),
       sort_order = COALESCE(?, sort_order)
     WHERE id = ?`,
    [
      patch.type ?? null,
      patch.title ?? null,
      patch.thumbnail ?? null,
      patch.url ?? null,
      patch.videoId ?? null,
      patch.source ?? null,
      patch.date ?? null,
      patch.articleContent ?? null,
      patch.shortDescription ?? null,
      patch.descriptionPurpose ?? null,
      patch.status ?? null,
      patch.sortOrder ?? null,
      id
    ]
  );

  if (patch.photoUrls !== undefined) {
    const json =
      Array.isArray(patch.photoUrls) && patch.photoUrls.length > 1
        ? JSON.stringify(patch.photoUrls)
        : null;
    await p.query('UPDATE media_items SET photo_urls_json = ? WHERE id = ?', [json, id]);
  }

  if (patch.fullArticleContent !== undefined || patch.inlineArticleContent !== undefined) {
    const val = patch.fullArticleContent ?? patch.inlineArticleContent;
    const normalized =
      typeof val === 'string' && val.trim() ? val.trim() : val === null ? null : undefined;
    if (normalized !== undefined) {
      await p.query('UPDATE media_items SET inline_article_content = ? WHERE id = ?', [normalized, id]);
    }
  }
}

export async function deleteMediaItem(id) {
  await ensureMediaSchema();
  const p = await getMediaPool();
  await p.query('DELETE FROM media_items WHERE id = ?', [id]);
}
