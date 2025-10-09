import { Flex } from "@chakra-ui/react"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import Navbar from "@/components/Common/Navbar" // 导航栏组件
import Sidebar from "@/components/Common/Sidebar" // 侧边栏组件
import { isLoggedIn } from "@/hooks/useAuth" // 认证状态检查钩子

/**
 * 布局路由配置
 *
 * 定义需要认证的页面布局
 */
export const Route = createFileRoute("/_layout")({
  component: Layout, // 布局组件
  beforeLoad: async () => { // 路由加载前的钩子
    if (!isLoggedIn()) { // 检查用户是否登录
      throw redirect({ // 未登录则重定向
        to: "/login", // 重定向到登录页
      })
    }
  },
})

/**
 * 布局组件
 *
 * 提供需要认证页面的统一布局
 */
function Layout() {
  return (
    /* 垂直方向布局容器 */
    <Flex direction="column" h="100vh"> {/* 全屏高度 */}
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主体内容区域 */}
      <Flex flex="1" overflow="hidden"> {/* 自适应高度并隐藏溢出 */}
        {/* 左侧侧边栏 */}
        <Sidebar />

        {/* 主要内容区域 */}
        <Flex
          flex="1" // 自适应宽度
          direction="column" // 垂直排列
          p={4} // 内边距
          overflowY="auto" // 垂直滚动
        >
          {/* 子路由出口 */}
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Layout
