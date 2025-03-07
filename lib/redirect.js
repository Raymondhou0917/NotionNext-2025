import fs from 'fs'

export function generateRedirectJson({ allPages }) {
  let uuidSlugMap = {}
  let validPageIds = new Set()

  // 收集所有有效頁面的 ID
  allPages.forEach(page => {
    if (page.type === 'Post' && page.status === 'Published') {
      uuidSlugMap[page.id] = page.slug
      validPageIds.add(page.id)
    }
  })

  // 將有效頁面 ID 列表寫入文件
  try {
    fs.writeFileSync('./public/redirect.json', JSON.stringify(uuidSlugMap))
    fs.writeFileSync('./public/valid-pages.json', JSON.stringify(Array.from(validPageIds)))
    console.log(`已生成重定向文件，包含 ${validPageIds.size} 個有效頁面`)
  } catch (error) {
    console.warn('無法寫入文件', error)
  }
}
