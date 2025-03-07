import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkStrIsNotionId, getLastPartOfUrl } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import BLOG from './blog.config'

/**
 * Clerk 身份验证中间件
 */
export const config = {
  // 这里设置白名单，防止静态资源被拦截
  matcher: ['/((?!.*\\..*|_next|/sign-in|/auth).*)', '/', '/(api|trpc)(.*)']
}

// 限制登录访问的路由
const isTenantRoute = createRouteMatcher([
  '/user/organization-selector(.*)',
  '/user/orgid/(.*)',
  '/dashboard',
  '/dashboard/(.*)'
])

// 限制权限访问的路由
const isTenantAdminRoute = createRouteMatcher([
  '/admin/(.*)/memberships',
  '/admin/(.*)/domain'
])

/**
 * 没有配置权限相关功能的返回
 * @param req
 * @param ev
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const noAuthMiddleware = async (req: NextRequest, ev: any) => {
  // 如果没有配置 Clerk 相关环境变量，返回一个默认响应或者继续处理请求
  if (BLOG['UUID_REDIRECT']) {
    let redirectJson: Record<string, string> = {}
    let validPageIds: string[] = []
    
    try {
      // 獲取重定向映射和有效頁面 ID 列表
      const redirectResponse = await fetch(`${req.nextUrl.origin}/redirect.json`)
      const validPagesResponse = await fetch(`${req.nextUrl.origin}/valid-pages.json`)
      
      if (redirectResponse.ok) {
        redirectJson = (await redirectResponse.json()) as Record<string, string>
      }
      
      if (validPagesResponse.ok) {
        validPageIds = await validPagesResponse.json() as string[]
      }
    } catch (err) {
      console.error('Error fetching static files:', err)
    }
    
    let lastPart = getLastPartOfUrl(req.nextUrl.pathname) as string
    
    // 檢查是否為 Notion ID 格式
    if (checkStrIsNotionId(lastPart)) {
      const uuidFormat = idToUuid(lastPart)
      
      // 檢查是否為有效的頁面 ID
      if (!validPageIds.includes(uuidFormat)) {
        console.log(`阻止訪問未知的 Notion ID: ${uuidFormat}`)
        return new NextResponse('頁面不存在', { status: 404 })
      }
      
      lastPart = uuidFormat
    }
    
    // 如果是有效 ID 且有對應的 slug，進行重定向
    if (lastPart && redirectJson[lastPart]) {
      const redirectToUrl = req.nextUrl.clone()
      redirectToUrl.pathname = '/' + redirectJson[lastPart]
      console.log(
        `重定向從 ${req.nextUrl.pathname} 到 ${redirectToUrl.pathname}`
      )
      return NextResponse.redirect(redirectToUrl, 308)
    }
  }
  return NextResponse.next()
}
/**
 * 鉴权中间件
 */
const authMiddleware = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? clerkMiddleware(async (auth, req) => {
      const { userId } = auth()
      // 处理 /dashboard 路由的登录保护
      if (isTenantRoute(req)) {
        if (!userId) {
          // 用户未登录，重定向到 /sign-in
          const url = new URL('/sign-in', req.url)
          url.searchParams.set('redirectTo', req.url) // 保存重定向目标
          return NextResponse.redirect(url)
        }
      }

      // 处理管理员相关权限保护
      if (isTenantAdminRoute(req)) {
        auth().protect(has => {
          return (
            has({ permission: 'org:sys_memberships:manage' }) ||
            has({ permission: 'org:sys_domains_manage' })
          )
        })
      }

      // 默认继续处理请求
      return NextResponse.next()
    })
  : noAuthMiddleware

export default authMiddleware
