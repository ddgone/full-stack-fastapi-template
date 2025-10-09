// 导入必要的库和模块
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query" // React Query 状态管理库
import { createRouter, RouterProvider } from "@tanstack/react-router" // 路由库
import { StrictMode } from "react" // React 严格模式
import ReactDOM from "react-dom/client" // React DOM 渲染库
import { ApiError, OpenAPI } from "./client" // API 客户端和错误类型
import { CustomProvider } from "./components/ui/provider" // 自定义UI提供者
import { routeTree } from "./routeTree.gen" // 自动生成的路由树

// 配置API客户端
OpenAPI.BASE = import.meta.env.VITE_API_URL // 设置API基础URL（从环境变量获取）
OpenAPI.TOKEN = async () => {
  // 设置获取访问令牌的函数
  return localStorage.getItem("access_token") || "" // 从本地存储获取访问令牌
}

/**
 * 处理API错误
 * 
 * 当遇到401（未授权）或403（禁止访问）错误时：
 * 1. 清除本地存储中的访问令牌
 * 2. 重定向到登录页面
 */
const handleApiError = (error: Error) => {
  // 检查是否为ApiError且状态码为401或403
  if (error instanceof ApiError && [401, 403].includes(error.status)) {
    localStorage.removeItem("access_token") // 清除访问令牌
    window.location.href = "/login" // 重定向到登录页
  }
}

/**
 * 创建QueryClient实例
 * 
 * 配置全局错误处理：
 * - 查询错误处理
 * - 变更错误处理
 */
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleApiError, // 设置查询错误处理函数
  }),
  mutationCache: new MutationCache({
    onError: handleApiError, // 设置变更错误处理函数
  }),
})

/**
 * 创建路由实例
 * 
 * 使用自动生成的路由树创建路由
 */
const router = createRouter({ routeTree })

/**
 * 注册路由类型
 * 
 * 为路由提供类型支持
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router // 注册路由类型
  }
}

/**
 * 渲染应用
 * 
 * 将整个应用渲染到根DOM节点
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  // 使用严格模式检测潜在问题
  <StrictMode>
    {/* 自定义UI提供者（包含主题、样式等） */}
    <CustomProvider>
      {/* React Query提供者（提供状态管理上下文） */}
      <QueryClientProvider client={queryClient}>
        {/* 路由提供者（提供路由上下文） */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </CustomProvider>
  </StrictMode>
)
