import fs from 'fs'

export async function generateRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link
  const content = `# robots.txt for ${LINK}
User-agent: *
Allow: /

# 禁止爬取 API 和系統目錄
Disallow: /api/
Disallow: /_next/

# 禁止爬取 Notion ID 格式的 URL (32 位 ID)
Disallow: /*[0-9a-f]{32}*

# 允許爬取有效的 slug 頁面
Allow: /*/[a-z0-9-]+$

# Host
Host: ${LINK}

# Sitemaps
Sitemap: ${LINK}/sitemap.xml

# 主站連結
# Main site: https://raymondhouch.com
`
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
