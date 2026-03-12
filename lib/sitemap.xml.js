import BLOG from '@/blog.config'
import fs from 'fs'
import { siteConfig } from './config'
/**
 * 生成站点地图
 * @param {*} param0
 */
export async function generateSitemapXml({ allPages, NOTION_CONFIG }) {
  const link = siteConfig('LINK', BLOG.LINK, NOTION_CONFIG).replace(/\/+$/, '').replace(/\u200b/g, '')
  const defaultFields = [
    siteConfig('SEO_INDEX_HOME', true, NOTION_CONFIG) && {
      loc: `${link}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    siteConfig('SEO_INDEX_ARCHIVE', false, NOTION_CONFIG) && {
      loc: `${link}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.6
    },
    siteConfig('SEO_INDEX_CATEGORY', false, NOTION_CONFIG) && {
      loc: `${link}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.4
    },
    siteConfig('SEO_INDEX_TAG', false, NOTION_CONFIG) && {
      loc: `${link}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.4
    }
  ].filter(Boolean)
  
  let skippedPageCount = 0
  
  // 收集所有頁面的字段
  const postFields = []
  
  // 只包含有效的頁面
  allPages?.forEach(post => {
    // 確保頁面有有效的 slug 且狀態為已發布
    if (
      post?.slug &&
      post.type === 'Post' &&
      post.status === 'Published' &&
      !post?.ext?.noindex &&
      siteConfig('SEO_INDEX_POSTS', true, NOTION_CONFIG)
    ) {
      const slugWithoutLeadingSlash = post.slug.startsWith('/')
        ? post.slug.slice(1)
        : post.slug
        
      // 確保 slug 不是 Notion ID 格式 (32位十六進位)
      if (!/^[0-9a-f]{32}$/.test(slugWithoutLeadingSlash)) {
        postFields.push({
          loc: `${link}/${slugWithoutLeadingSlash}`,
          lastmod: new Date(
            post?.lastEditedDate || post?.publishDay || new Date()
          )
            .toISOString()
            .split('T')[0],
          changefreq: 'weekly'
        })
      } else {
        skippedPageCount++
      }
    } else {
      skippedPageCount++
    }
  })
  
  // 去除重複的 URL
  const uniqueFields = getUniqueFields(postFields)
  const validPageCount = uniqueFields.length
  
  // 合併默認頁面和文章頁面
  const urls = defaultFields.concat(uniqueFields)
  
  // 生成 sitemap XML
  const xml = createSitemapXml(urls)
  
  try {
    fs.writeFileSync('sitemap.xml', xml)
    fs.writeFileSync('./public/sitemap.xml', xml)
    
    // 寫入 sitemap 統計信息
    const sitemapStats = {
      generatedAt: new Date().toISOString(),
      totalUrls: urls.length,
      validPageCount,
      skippedPageCount
    }
    
    fs.writeFileSync('./public/sitemap-stats.json', JSON.stringify(sitemapStats, null, 2))
    
    console.log(`生成 sitemap.xml 成功，包含 ${urls.length} 個 URL，其中 ${validPageCount} 個有效頁面，跳過 ${skippedPageCount} 個無效頁面`)
  } catch (error) {
    console.warn('無法寫入 sitemap 文件', error)
  }
}

/**
 * 生成站点地图
 * @param {*} urls
 * @returns
 */
function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    </url>
    `
  })

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlsXml}
    </urlset>
    `
}

/**
 * 去除重複的字段
 * @param {*} fields 
 * @returns 
 */
function getUniqueFields(fields) {
  const uniqueSiteMap = new Map()
  
  fields.forEach(field => {
    const existingField = uniqueSiteMap.get(field.loc)
    
    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueSiteMap.set(field.loc, field)
    }
  })
  
  return Array.from(uniqueSiteMap.values())
}
