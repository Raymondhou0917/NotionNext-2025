import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const PATH = siteConfig('PATH')
  const LINK = siteConfig('LINK')
  const SUB_PATH = siteConfig('SUB_PATH', '')
  let url = PATH?.length
    ? `${LINK}/${SUB_PATH}`
    : LINK
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')

  useEffect(() => {
    // 使用WebFontLoader字体加载
    loadExternalResource(
      'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
      'js'
    ).then(url => {
      const WebFont = window?.WebFont
      if (WebFont) {
        // console.log('LoadWebFont', webFontUrl)
        WebFont.load({
          custom: {
            // families: ['"LXGW WenKai"'],
            urls: webFontUrl
          }
        })
      }
    })
  }, [])

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    url = `${url}/${meta.slug}`
    image = meta.image || '/bg_image.jpg'
  }
  const TITLE = siteConfig('SITE_TITLE') || '雷蒙三十的社群內容彙整';
  const description = meta?.description || `${siteConfig('AUTHOR')}的社群內容彙整，AI 自動化工作應用、Notion 教學、一人公司經營和個人生產力秘訣。`;
  const type = meta?.type || 'website'
  const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || KEYWORDS // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const favicon = siteConfig('BLOG_FAVICON')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
    'SEO_BAIDU_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)

  const COMMENT_WEBMENTION_ENABLE = siteConfig(
    'COMMENT_WEBMENTION_ENABLE',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
    'COMMENT_WEBMENTION_HOSTNAME',
    null,
    NOTION_CONFIG
  )
  const COMMENT_WEBMENTION_AUTH = siteConfig(
    'COMMENT_WEBMENTION_AUTH',
    null,
    NOTION_CONFIG
  )
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
    'ANALYTICS_BUSUANZI_ENABLE',
    null,
    NOTION_CONFIG
  )

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)

  const AUTHOR = siteConfig('AUTHOR')
  return (
    <Head>
      <link rel='icon' href={favicon} />
      <title>{meta?.title || TITLE}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta name='robots' content='follow, index' />
      <meta charSet='UTF-8' />
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name='baidu-site-verification'
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}
      <meta name='description' content={meta?.description || `${siteConfig('AUTHOR')}的社群內容彙整，AI 自動化工作應用、Notion 教學、一人公司經營和個人生產力秘訣。`} />
      <meta name='keywords' content={keywords} />
      <meta name='author' content={siteConfig('AUTHOR')} />
      <meta property='og:title' content={meta?.title || siteConfig('SITE_TITLE')} />
      <meta property='og:description' content={meta?.description || `${siteConfig('AUTHOR')}的社群內容彙整，AI 自動化工作應用、Notion 教學、一人公司經營和個人生產力秘訣。`} />
      <meta property='og:site_name' content={siteConfig('SITE_TITLE')} />
      <meta property='og:locale' content={lang} />
      <meta property='og:image' content={meta?.image || siteConfig('HOME_BANNER_IMAGE')} />
      <meta property='og:type' content={meta?.type || 'website'} />
      <meta property='og:url' content={url} />
      <link rel='canonical' href={`https://raymondhouch.com${router.asPath}`} />
      <meta name='robots' content='index,follow' />
      <link rel='icon' href={BLOG_FAVICON} />

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link
            rel='webmention'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
          />
          <link
            rel='pingback'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
          />
          {COMMENT_WEBMENTION_AUTH && (
            <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
          )}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />
        </>
      )}
      {children}
    </Head>
  )
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const TITLE_SUFFIX = ' | 雷蒙的社群內容彙整';
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props;
  const IMAGE = siteInfo?.pageCover || '/default-share-image.jpg';
  const DESCRIPTION =
  siteInfo?.description ||
  '探索數位工具、AI 自動化應用和生產力秘訣，這裡是雷蒙三十的社群內容整理站，幫助你聰明工作、好好生活。';
  const TITLE = siteConfig('SITE_TITLE')
  const title = TITLE;
  switch (router.route) {
    case '/':
      return { 
        title: TITLE, 
        description: DESCRIPTION, 
        image: IMAGE, slug: '', 
        type: 'website' 
      };
      case '/archive':
        return { 
          title: `文章歸檔${TITLE_SUFFIX}`,
          description: '過往社群媒體內容彙整。', 
          image: IMAGE, 
          slug: 'archive', 
          type: 'website' };
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: TITLE,
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | 页面找不到啦`,
        image: `${siteInfo?.pageCover}`
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${post?.title} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default SEO
