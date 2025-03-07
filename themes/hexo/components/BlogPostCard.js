import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  
  // 特色圖片處理邏輯改進
  // 1. 檢查文章是否有封面圖
  // 2. 如果沒有封面圖，檢查文章內容中是否有圖片
  // 3. 如果內容中也沒有圖片，使用網站預設圖片
  if (post && !post.pageCoverThumbnail) {
    // 嘗試從文章內容中提取第一張圖片作為特色圖片
    if (post.blockMap) {
      const blocks = Object.values(post.blockMap.block || {})
      for (const block of blocks) {
        if (block.value?.type === 'image' && block.value?.properties?.source?.[0]?.[0]) {
          post.pageCoverThumbnail = block.value.properties.source[0][0]
          break
        }
      }
    }
    
    // 如果仍然沒有找到圖片，使用預設圖片
    if (!post.pageCoverThumbnail && siteConfig('HEXO_POST_LIST_COVER_DEFAULT', null, CONFIG)) {
      post.pageCoverThumbnail = siteInfo?.pageCover
    }
  }
  const showPageCover =
    siteConfig('HEXO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview
  //   const delay = (index % 2) * 200

  return (
    <div
      className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`}>
      <div
        key={post.id}
        data-aos='fade-up'
        data-aos-easing='ease-in-out'
        data-aos-duration='500'
        data-aos-once='false'
        data-aos-anchor-placement='top-bottom'
        id='blog-post-card'
        className={`group md:h-56 w-full flex justify-between md:flex-row flex-col-reverse ${siteConfig('HEXO_POST_LIST_IMG_CROSSOVER', null, CONFIG) && index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                    overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>
        {/* 文字内容 */}
        <BlogPostCardInfo
          index={index}
          post={post}
          showPageCover={showPageCover}
          showPreview={showPreview}
          showSummary={showSummary}
        />

        {/* 图片封面 */}
        {showPageCover && (
          <div className='md:w-5/12 overflow-hidden'>
            <Link href={post?.href}>
              <>
                <LazyImage
                  priority={index === 1}
                  alt={post?.title}
                  src={post?.pageCoverThumbnail}
                  className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
                />
              </>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
