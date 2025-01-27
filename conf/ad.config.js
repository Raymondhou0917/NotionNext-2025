/**
 * 广告播放插件
 */
module.exports = {
  // 谷歌广告
  ADSENSE_GOOGLE_ID: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_ID || 'ca-pub-6981486624971493', // 谷歌广告ID e.g ca-pub-xxxxxxxxxxxxxxxx
  ADSENSE_GOOGLE_TEST: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_TEST || false, // 谷歌广告ID测试模式，这种模式获取假的测试广告，用于开发
  ADSENSE_GOOGLE_SLOT_IN_ARTICLE:
    process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_IN_ARTICLE || '8007541045', // 文章內嵌廣告
  ADSENSE_GOOGLE_SLOT_FLOW:
    process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_FLOW || '6373027182', // 動態內廣告
  ADSENSE_GOOGLE_SLOT_AUTO:
    process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_AUTO || '1386292371', // 多媒體廣告

  // 万维广告
  AD_WWADS_ID: process.env.NEXT_PUBLIC_WWAD_ID || null, // https://wwads.cn/ 创建您的万维广告单元ID
  AD_WWADS_BLOCK_DETECT: process.env.NEXT_PUBLIC_WWADS_AD_BLOCK_DETECT || false // 是否开启WWADS广告屏蔽插件检测
}
