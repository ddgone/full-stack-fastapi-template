import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link as RouterLink } from "@tanstack/react-router"
import { FiBriefcase, FiHome, FiSettings, FiUsers } from "react-icons/fi"
import type { IconType } from "react-icons/lib"

import type { UserPublic } from "@/client"

/**
 * 基础菜单项配置
 *
 * 包含所有用户可见的菜单项
 */
const items = [
  { icon: FiHome, title: "仪表盘", path: "/" },
  { icon: FiBriefcase, title: "项目管理", path: "/items" },
  { icon: FiSettings, title: "用户设置", path: "/settings" },
]

/**
 * 侧边栏菜单项组件属性
 *
 * @property onClose 关闭回调函数（用于移动端抽屉菜单）
 */
interface SidebarItemsProps {
  onClose?: () => void
}

/**
 * 菜单项类型定义
 */
interface Item {
  icon: IconType // 菜单图标组件
  title: string // 菜单标题
  path: string // 菜单路径
}

/**
 * 侧边栏菜单项组件
 *
 * 根据用户权限渲染不同的菜单项
 *
 * @param onClose 关闭回调函数（用于移动端抽屉菜单）
 */
const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  // 查询客户端实例
  const queryClient = useQueryClient()

  // 获取当前用户信息
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  /**
   * 最终菜单项列表
   *
   * 如果是超级管理员，添加管理员菜单项
   */
  const finalItems: Item[] = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "管理员", path: "/admin" }]
    : items

  /**
   * 渲染菜单项列表
   *
   * 每个菜单项都是可点击的链接
   */
  const listItems = finalItems.map(({ icon, title, path }) => (
    // 路由链接
    <RouterLink key={title} to={path} onClick={onClose}>
      {/* 菜单项容器 */}
      <Flex
        gap={4} // 元素间距
        px={4} // 水平内边距
        py={2} // 垂直内边距
        _hover={{
          background: "gray.subtle", // 悬停背景色
        }}
        alignItems="center" // 垂直居中
        fontSize="sm" // 字体大小
      >
        {/* 菜单图标 */}
        <Icon as={icon} alignSelf="center" />

        {/* 菜单标题 */}
        <Text ml={2}>{title}</Text>
      </Flex>
    </RouterLink>
  ))

  return (
    <>
      {/* 菜单标题 */}
      <Text fontSize="xs" px={4} py={2} fontWeight="bold">
        菜单
      </Text>

      {/* 菜单项容器 */}
      <Box>{listItems}</Box>
    </>
  )
}

export default SidebarItems