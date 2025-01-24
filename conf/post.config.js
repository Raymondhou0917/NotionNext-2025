/**
 * 文章相關功能
 */
module.exports = {
  // 文章 URL 前綴
  POST_URL_PREFIX: process.env.NEXT_PUBLIC_POST_URL_PREFIX ?? 'article',
  // POST 類型文章的預設路徑前綴，例如預設 POST 類型的路徑是 /article/[slug]
  // 如果此項配置為 '' 空，則文章將沒有前綴路徑
  // 支援類似 WP 可自訂文章連結格式的功能：https://wordpress.org/documentation/article/customize-permalinks/，目前只先實作 %year%/%month%/%day%
  // 例：如想連結改成前綴 article + 時間戳記，可變更為： 'article/%year%/%month%/%day%'

  POST_SCHEDULE_PUBLISH:
    process.env.NEXT_PUBLIC_NOTION_SCHEDULE_PUBLISH || true, // 按照文章的發布時間欄位，控制自動上下架

  // 分享列
  POST_SHARE_BAR_ENABLE: process.env.NEXT_PUBLIC_POST_SHARE_BAR || 'true', // 文章底部分享列開關
  POSTS_SHARE_SERVICES:
    process.env.NEXT_PUBLIC_POST_SHARE_SERVICES ||
    'link,wechat,weibo,email,facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin', // 分享的服務，按順序顯示，逗號隔開
  // 所有支援的分享服務：link(複製連結),wechat(微信),qq,weibo(微博),email(郵件),facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin,vkshare,okshare,tumblr,livejournal,mailru,viber,workplace,pocket,instapaper,hatena

  POST_TITLE_ICON: process.env.NEXT_PUBLIC_POST_TITLE_ICON || true, // 是否顯示標題 icon
  POST_DISABLE_GALLERY_CLICK:
    process.env.NEXT_PUBLIC_POST_DISABLE_GALLERY_CLICK || false, // 畫冊視圖禁止點擊，方便在友鏈頁面的畫冊插入連結
  POST_LIST_STYLE: process.env.NEXT_PUBLIC_POST_LIST_STYLE || 'page', // ['page','scroll] 文章列表樣式：頁碼分頁、單頁滾動加載
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_PREVIEW || 'true', // 是否在列表加載文章預覽
  POST_PREVIEW_LINES: process.env.NEXT_PUBLIC_POST_POST_PREVIEW_LINES || 8, // 預覽部落格行數
  POST_RECOMMEND_COUNT: process.env.NEXT_PUBLIC_POST_RECOMMEND_COUNT || 4, // 推薦文章數量
  POSTS_PER_PAGE: process.env.NEXT_PUBLIC_POST_PER_PAGE || 6, // 每頁文章數量
  POSTS_SORT_BY: process.env.NEXT_PUBLIC_POST_SORT_BY || 'notion', // 排序方式：'date' 按時間，'notion' 由 notion 控制
  POST_WAITING_TIME_FOR_404:
    process.env.NEXT_PUBLIC_POST_WAITING_TIME_FOR_404 || '10', // 文章加載超時時間，單位秒；超時後跳轉到 404 頁面

  // 標籤相關
  TAG_SORT_BY_COUNT: true, // 標籤是否按照文章數量倒序排列
  IS_TAG_COLOR_DISTINGUISHED:
    process.env.NEXT_PUBLIC_IS_TAG_COLOR_DISTINGUISHED === 'true' || true // 對於名稱相同的 tag 是否區分 tag 的顏色
}
