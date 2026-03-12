import fs from 'fs'
import BLOG from '@/blog.config'
import { siteConfig } from './config'

export async function generateRobotsTxt(props) {
  const { siteInfo, NOTION_CONFIG } = props
  const LINK = siteInfo?.link
  const disallowRoutes = ['/api/', '/_next/', '/search', '/search/']

  if (!siteConfig('SEO_INDEX_ARCHIVE', false, NOTION_CONFIG)) {
    disallowRoutes.push('/archive')
  }
  if (!siteConfig('SEO_INDEX_CATEGORY', false, NOTION_CONFIG)) {
    disallowRoutes.push('/category', '/category/')
  }
  if (!siteConfig('SEO_INDEX_TAG', false, NOTION_CONFIG)) {
    disallowRoutes.push('/tag', '/tag/')
  }

  const content = `# robots.txt for ${LINK}
User-agent: *
Allow: /

# 禁止爬取低價值頁面與系統目錄
${Array.from(new Set(disallowRoutes))
  .map(route => `Disallow: ${route}`)
  .join('\n')}

# 禁止爬取 Notion ID 格式的 URL (32 位 ID)
Disallow: /*[0-9a-f]{32}*

# Host
Host: ${LINK}

# Sitemaps
Sitemap: ${LINK}/sitemap.xml

# 主站連結
# Main site: ${siteConfig('MAIN_BLOG_LINK', BLOG.MAIN_BLOG_LINK, NOTION_CONFIG)}
`
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
