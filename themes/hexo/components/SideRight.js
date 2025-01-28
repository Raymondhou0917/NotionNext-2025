import Live2D from '@/components/Live2D'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import CONFIG from '../config'
import { AnalyticsCard } from './AnalyticsCard'
import Announcement from './Announcement'
import Card from './Card'
import Catalog from './Catalog'
import CategoryGroup from './CategoryGroup'
import { InfoCard } from './InfoCard'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import { AdSlot } from '@/components/GoogleAdsense'

const HexoRecentComments = dynamic(() => import('./HexoRecentComments'))
const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const {
    post,
    currentCategory,
    categories,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag,
    rightAreaSlot,
    notice,
    className
  } = props

  const { locale } = useGlobal()

  // 文章全屏处理
  const fullWidth = post?.fullWidth ?? false
  const showRightArea = siteConfig('RIGHT_PANEL', null, CONFIG)

  if (!showRightArea) {
    return null
  }

  return (
    <div className={`${className || ''}`}>
      <div className='sticky top-8'>
        {/* 广告 */}
        <Card>
          <AdSlot type='auto' />
        </Card>

        {notice && <Announcement post={notice} />}
        
        {rightAreaSlot}

        {!fullWidth && post && post?.toc && (
          <Card>
            <Catalog toc={post.toc} />
          </Card>
        )}

        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) && (
          <Card>
            <AnalyticsCard {...props} />
          </Card>
        )}

        {/* 信息卡片 */}
        {siteConfig('HEXO_WIDGET_PROFILE_ENABLE', null, CONFIG) && (
          <Card>
            <InfoCard {...props} />
            {/* 广告 */}
            <div className='mt-4'>
              <AdSlot type='flow' />
            </div>
          </Card>
        )}

        {showCategory && (
          <Card>
            <div className='ml-2 mb-1 font-sans'>
              <i className='fas fa-th' /> {locale.COMMON.CATEGORY}
            </div>
            <CategoryGroup
              currentCategory={currentCategory}
              categories={categories}
            />
          </Card>
        )}

        {showTag && (
          <Card>
            <div className='ml-2 mb-1 font-sans'>
              <i className='fas fa-tag' /> {locale.COMMON.TAGS}
            </div>
            <TagGroups tags={tags} currentTag={currentTag} />
          </Card>
        )}

        {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) &&
          latestPosts &&
          latestPosts.length > 0 && (
            <Card>
              <LatestPostsGroup {...props} />
            </Card>
          )}

        {/* 展示Live2D */}
        <div className='flex justify-center'>
          <Live2D />
        </div>

        {/* 底部嵌入 */}
        <div id='sidebar-bottom' className='justify-center'>
          {siteConfig('FACEBOOK_PAGE_TITLE') && (
            <Card>
              <FaceBookPage />
            </Card>
          )}
          {siteConfig('COMMENT_WALINE_SERVER_URL') && (
            <Card>
              <HexoRecentComments />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
