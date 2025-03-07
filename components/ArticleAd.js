import { useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 文章內廣告組件
 */
const ArticleAd = () => {
  const adRef = useRef(null)
  const ADSENSE_GOOGLE_ID = siteConfig('ADSENSE_GOOGLE_ID')

  useEffect(() => {
    if (ADSENSE_GOOGLE_ID && adRef.current) {
      try {
        // 確保 adsbygoogle 已經被定義
        if (window.adsbygoogle) {
          window.adsbygoogle.push({})
        }
      } catch (err) {
        console.error('Error loading article ad:', err)
      }
    }
  }, [])

  if (!ADSENSE_GOOGLE_ID) return null

  return (
    <div className="my-8">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_GOOGLE_ID}
        data-ad-slot="8007541045"
      />
    </div>
  )
}

export default ArticleAd
