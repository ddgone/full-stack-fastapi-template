import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FaBars } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"

import type { UserPublic } from "@/client"
import useAuth from "@/hooks/useAuth"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
} from "../ui/drawer"
import SidebarItems from "./SidebarItems"

/**
 * 侧边栏组件
 *
 * 提供响应式侧边栏，在移动端显示为抽屉式菜单，在桌面端显示为固定侧边栏
 */
const Sidebar = () => {
  // 查询客户端实例
  const queryClient = useQueryClient()

  // 获取当前用户信息
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  // 认证钩子（包含登出功能）
  const { logout } = useAuth()

  // 抽屉菜单打开状态
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 移动端视图（抽屉式菜单） */}
      <DrawerRoot
        placement="start" // 从左侧滑出
        open={open} // 控制打开状态
        onOpenChange={({ open }) => setOpen(open)} // 状态变化回调
      >
        {/* 抽屉背景遮罩 */}
        <DrawerBackdrop />

        {/* 抽屉触发按钮（汉堡菜单图标） */}
        <DrawerTrigger asChild>
          <IconButton
            variant="ghost" // 透明背景
            color="inherit" // 继承颜色
            display={{ base: "flex", md: "none" }} // 仅在小屏幕显示
            aria-label="打开菜单" // 无障碍标签
            position="absolute" // 绝对定位
            zIndex="100" // 层级
            m={4} // 外边距
          >
            <FaBars /> {/* 汉堡菜单图标 */}
          </IconButton>
        </DrawerTrigger>

        {/* 抽屉内容 */}
        <DrawerContent maxW="xs"> {/* 最大宽度 */}
          {/* 抽屉关闭触发器 */}
          <DrawerCloseTrigger />

          <DrawerBody>
            {/* 抽屉内容布局 */}
            <Flex flexDir="column" justify="space-between">
              <Box>
                {/* 侧边栏菜单项 */}
                <SidebarItems onClose={() => setOpen(false)} />

                {/* 登出按钮 */}
                <Flex
                  as="button" // 渲染为按钮
                  onClick={() => {
                    logout() // 执行登出
                  }}
                  alignItems="center" // 垂直居中
                  gap={4} // 元素间距
                  px={4} // 水平内边距
                  py={2} // 垂直内边距
                >
                  <FiLogOut /> {/* 登出图标 */}
                  <Text>登出</Text>
                </Flex>
              </Box>

              {/* 当前用户信息 */}
              {currentUser?.email && (
                <Text
                  fontSize="sm" // 小号字体
                  p={2} // 内边距
                  truncate // 文本截断
                  maxW="sm" // 最大宽度
                >
                  登录账号: {currentUser.email}
                </Text>
              )}
            </Flex>
          </DrawerBody>

          {/* 抽屉关闭触发器（底部） */}
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

      {/* 桌面端视图（固定侧边栏） */}
      <Box
        display={{ base: "none", md: "flex" }} // 仅在中大屏幕显示
        position="sticky" // 粘性定位
        bg="bg.subtle" // 背景颜色
        top={0} // 顶部贴边
        minW="xs" // 最小宽度
        h="100vh" // 全屏高度
        p={4} // 内边距
      >
        <Box w="100%">
          {/* 侧边栏菜单项 */}
          <SidebarItems />
        </Box>
      </Box>
    </>
  )
}

export default Sidebar