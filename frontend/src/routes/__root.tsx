import { createRootRoute, Outlet } from "@tanstack/react-router"
import React, { Suspense } from "react"

import NotFound from "@/components/Common/NotFound" // 404页面组件

/**
 * 动态加载开发工具
 *
 * 在开发环境中加载路由和React Query的开发工具
 */
const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"), // 路由开发工具
    import("@tanstack/react-query-devtools"), // React Query开发工具
  ]).then(([routerDevtools, reactQueryDevtools]) => {
    return {
      default: () => (
        <>
          {/* 路由开发工具 */}
          <routerDevtools.TanStackRouterDevtools />
          {/* React Query开发工具 */}
          <reactQueryDevtools.ReactQueryDevtools />
        </>
      ),
    }
  })

/**
 * 开发工具组件
 *
 * 在生产环境中返回空组件，在开发环境中动态加载开发工具
 */
const TanStackDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // 生产环境返回空组件
    : React.lazy(loadDevtools) // 开发环境动态加载

/**
 * 创建根路由
 *
 * 定义应用的根路由配置
 */
export const Route = createRootRoute({
  /**
   * 根路由组件
   *
   * 渲染子路由和开发工具
   */
  component: () => (
    <>
      {/* 子路由出口 */}
      <Outlet />

      {/* 开发工具容器（使用Suspense处理加载状态） */}
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),

  /**
   * 404组件
   *
   * 当路由不匹配时显示
   */
  notFoundComponent: () => <NotFound />,
})
