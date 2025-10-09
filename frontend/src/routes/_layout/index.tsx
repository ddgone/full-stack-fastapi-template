import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "@/hooks/useAuth"

// 创建仪表盘路由
export const Route = createFileRoute("/_layout/")({
  component: Dashboard, // 路由对应的组件
})

// 仪表盘组件
function Dashboard() {
  // 使用认证钩子获取当前用户信息
  const { user: currentUser } = useAuth()

  return (
    // 全宽容器
    <Container maxW="full">
      {/* 内容区域 */}
      <Box pt={12} m={4}>
        {/* 欢迎标题 */}
        <Text fontSize="2xl" truncate maxW="sm">
          您好, {currentUser?.full_name || currentUser?.email} 👋🏼
        </Text>
        {/* 欢迎信息 */}
        <Text>欢迎回来，很高兴再次见到您！</Text>
      </Box>
    </Container>
  )
}
