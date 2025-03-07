import BLOG from '@/blog.config'
import fs from 'fs'
import { siteConfig } from './config'
/**
 * 生成站点地图
 * @param {*} param0
 */
export async function generateSitemapXml({ allPages, NOTION_CONFIG }) {
  const link = siteConfig('LINK', BLOG.LINK, NOTION_CONFIG)
  const urls = [
    {
      loc: `${link}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    },
    {
      loc: `${link}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    }
  ]
  
  // 記錄有效頁面數量
  let validPageCount = 0
  let skippedPageCount = 0
  
  // 只包含有效的頁面
  allPages?.forEach(post => {
    // 確保頁面有有效的 slug 且狀態為已發布
    if (post?.slug && post.type === 'Post' && post.status === 'Published') {
      const slugWithoutLeadingSlash = post.slug.startsWith('/')
        ? post.slug.slice(1)
        : post.slug
        
      // 確保 slug 不是 Notion ID 格式 (32位十六進位)
      if (!/^[0-9a-f]{32}$/.test(slugWithoutLeadingSlash)) {
        urls.push({
          loc: `${link}/${slugWithoutLeadingSlash}`,
          lastmod: new Date(post?.publishDay || new Date()).toISOString().split('T')[0],
          changefreq: 'daily'
        })
        validPageCount++
      } else {
        skippedPageCount++
      }
    } else {
      skippedPageCount++
    }
  }
  
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
