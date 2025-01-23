// 注: process.env.XX是Vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a

const BLOG = {
  // Important page_id！！！Duplicate Template from  https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5
  SITE_TITLE: process.env.NEXT_PUBLIC_SITE_TITLE || '雷蒙三十的社群內容彙整｜一人公司與數位遊牧實踐者的日常分享', // 默認標題
  SITE_DESCRIPTION: '雷蒙三十品牌內容主站＆電子報訂閱，請前往 raymondhouch.com',
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID ||
    '7c78ffee2b0e427787a4ab6c7ea898fb',
  THEME: process.env.NEXT_PUBLIC_THEME || 'hexo', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 example,fukasawa,gitbook,heo,hexo,landing,matery,medium,next,nobelium,plog,simple
  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-TW', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  SINCE: process.env.NEXT_PUBLIC_SINCE || new Date().getFullYear(), // e.g if leave this empty, current year will be used.

  PSEUDO_STATIC: process.env.NEXT_PUBLIC_PSEUDO_STATIC || false, // 伪静态路径，开启后所有文章URL都以 .html 结尾。
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 5, // 更新缓存间隔 单位(秒)；即每个页面有5秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省Vercel资源、同时提升访问速率，但也会使文章更新有延迟。
  APPEARANCE: process.env.NEXT_PUBLIC_APPEARANCE || 'light', // ['light', 'dark', 'auto'], // light 日间模式 ， dark夜间模式， auto根据时间和主题自动夜间模式
  APPEARANCE_DARK_TIME: process.env.NEXT_PUBLIC_APPEARANCE_DARK_TIME || [18, 6], // 夜间模式起至时间，false时关闭根据时间自动切换夜间模式

  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || '侯智薰（雷蒙）', // 您的昵称 例如 tangly1024
  BIO: process.env.NEXT_PUBLIC_BIO || 'Be the Lifehacker 🚀 一個實踐一人公司的創作者。', // 作者简介
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://newsletters.raymondhouch.com', // 网站地址
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || '雷蒙三十, 侯智薰, 社群內容彙整, AI自動化, Notion, ChatGPT, 智能工作宅, 生產力工具, 數位遊牧, 一人公司, Solopreneur', // 网站关键词 英文逗号隔开
  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png
  BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '', // 备案号 闽ICP备XXXXXX
  BEI_AN_LINK: process.env.NEXT_PUBLIC_BEI_AN_LINK || 'https://raymondhouch.com/', // 备案查询链接，如果用了萌备等备案请在这里填写

  ANALYTICS_GOOGLE_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-41MLSE3WQ9', // Google Analytics
  MAIN_BLOG_LINK: 'https://raymondhouch.com', // 主站連結

  // RSS订阅
  ENABLE_RSS: process.env.NEXT_PUBLIC_ENABLE_RSS || 'true', // 是否开启RSS订阅功能

  // 其它复杂配置
  // 原配置文件过长，且并非所有人都会用到，故此将配置拆分到/conf/目录下, 按需找到对应文件并修改即可
  ...require('./conf/comment.config'), // 评论插件
  ...require('./conf/contact.config'), // 作者联系方式配置
  ...require('./conf/post.config'), // 文章与列表配置
  ...require('./conf/analytics.config'), // 站点访问统计
  ...require('./conf/image.config'), // 网站图片相关配置
  ...require('./conf/font.config'), // 网站字体
  ...require('./conf/right-click-menu'), // 自定义右键菜单相关配置
  ...require('./conf/code.config'), // 网站代码块样式
  ...require('./conf/animation.config'), // 动效美化效果
  ...require('./conf/widget.config'), // 悬浮在网页上的挂件，聊天客服、宠物挂件、音乐播放器等
  ...require('./conf/ad.config'), // 广告营收插件
  ...require('./conf/plugin.config'), // 其他第三方插件 algolia全文索引

  // 高级用法
  ...require('./conf/layout-map.config'), // 路由与布局映射自定义，例如自定义特定路由的页面布局
  ...require('./conf/notion.config'), // 读取notion数据库相关的扩展配置，例如自定义表头
  ...require('./conf/dev.config'), // 开发、调试时需要关注的配置

  // 自定义外部脚本，外部样式
  CUSTOM_EXTERNAL_JS: [''], // e.g. ['http://xx.com/script.js','http://xx.com/script.js']
  CUSTOM_EXTERNAL_CSS: [''], // e.g. ['http://xx.com/style.css','http://xx.com/style.css']

  // 自定义菜单
  CUSTOM_MENU: process.env.NEXT_PUBLIC_CUSTOM_MENU || true, // 支持Menu类型的菜单，替代了3.12版本前的Page类型

  // 全局自定义CSS
  CUSTOM_CSS: `
  /* 導航欄顏色 */
  #sticky-nav.bg-indigo-700 {
    background-color: #21A4B1;
  }

  /* 夜間模式導航欄顏色 */
  .dark div#sticky-nav {
    background-color: #21A4B1;
  }

  /* 首頁開始閱讀按鈕 */
  .glassmorphism.w-40.z-40 {
    background-color: #21A4B1;
    border: none;
  }

  /* 標籤顏色 */
  a.cursor-pointer.bg-indigo-700 {
    background-color: #21A4B1;
  }

  /* 移動端側邊欄 */
  #side-bar>.bg-indigo-700 {
    background-color: #21A4B1;
  }

  /* 移動端側邊欄選單 */
  nav div:hover,li:hover {
    background-color: #21A4B1!important;
  }

  /* 懸浮選單 */
  .right-2 .bg-indigo-700 {
    background-color: #21A4B1;
  }

  /* 目錄進度條 */
  .h-4.bg-indigo-400 {
    background-color: #21A4B1;
  }

  /* 目錄文字高亮 */
  nav .text-green-500{
    color: #21A4B1;
  }

  /* 網站頁尾 */ 
  footer.bg-indigo-700{
    background-color: #21A4B1;
  }

  /* 翻頁按鈕 */
  button.bg-indigo-700{
    background-color: #21A4B1;
  }

  /* 隱藏文章頁發布時間 */
  #article-wrapper > div.wow.fadeInUp.px-10 > section > div.flex.flex-wrap.gap-3.mt-5.text-sm > a {
    display: none;
  }

  /* 隱藏文章頁更新時間 */
  #article-wrapper > div.wow.fadeInUp.px-10 > section > div.flex.flex-wrap.gap-3.mt-5.text-sm > span.whitespace-nowrap {
    display: none;
  }

  /* 隱藏文章頁閱讀次數 */
  #article-wrapper .busuanzi_container_page_pv {
    display: none !important;
  }

  /* 隱藏文章頁字數 */
  #wordCountWrapper > span:nth-child(1){
    display: none !important;
  }

  /* 隱藏文章頁閱讀時長 */
  #wordCountWrapper > span:nth-child(2){
    display: none;
  }
  `,

  // 文章列表相关设置
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || true, // 是否允许复制页面内容 默认允许，如果设置为false、则全栈禁止复制内容。

  // 侧栏布局 是否反转(左变右,右变左) 已支持主题: hexo next medium fukasawa example
  LAYOUT_SIDEBAR_REVERSE:
    process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE || false,

  // 欢迎语打字效果,Hexo,Matery主题支持, 英文逗号隔开多个欢迎语。
  GREETING_WORDS:
    process.env.NEXT_PUBLIC_GREETING_WORDS ||
    'Hi，我是侯智薰（雷蒙），歡迎來到我的社群媒體的內容彙整站，主要內容網站為：raymondhouch.com',

  // uuid重定向至 slug
  UUID_REDIRECT: process.env.UUID_REDIRECT || false
}

module.exports = BLOG
