import BLOG from '@/blog.config'

const NOTION_API_BASE = 'https://api.notion.com/v1'

function getHeaders() {
  if (!BLOG.NOTION_API_KEY) {
    throw new Error('Missing NOTION_API_KEY for official Notion API')
  }

  return {
    Authorization: `Bearer ${BLOG.NOTION_API_KEY}`,
    'Content-Type': 'application/json',
    'Notion-Version': BLOG.NOTION_API_VERSION
  }
}

async function notionRequest(path, options = {}) {
  const res = await fetch(`${NOTION_API_BASE}${path}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Notion API ${res.status}: ${text}`)
  }

  return res.json()
}

export async function retrieveDatabase(databaseId) {
  return notionRequest(`/databases/${databaseId}`)
}

export async function retrieveDataSource(dataSourceId) {
  return notionRequest(`/data_sources/${dataSourceId}`)
}

export async function queryDataSourceAll(dataSourceId, payload = {}) {
  const results = []
  let hasMore = true
  let startCursor

  while (hasMore) {
    const response = await notionRequest(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        page_size: 100,
        ...payload,
        ...(startCursor ? { start_cursor: startCursor } : {})
      })
    })

    results.push(...(response.results || []))
    hasMore = Boolean(response.has_more)
    startCursor = response.next_cursor
  }

  return results
}
