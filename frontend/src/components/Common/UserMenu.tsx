import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FaUserAstronaut } from "react-icons/fa"
import { FiLogOut, FiUser } from "react-icons/fi"

import useAuth from "@/hooks/useAuth"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu"

/**
 * 用户菜单组件
 *
 * 提供用户相关的操作菜单（查看个人资料、退出登录）
 */
const UserMenu = () => {
  // 使用认证钩子获取用户信息和登出函数
  const { user, logout } = useAuth()

  /**
   * 处理登出操作
   */
  const handleLogout = async () => {
    logout()
  }

  return (
    <>
      {/* 桌面端视图 */}
      <Flex>
        {/* 菜单根组件 */}
        <MenuRoot>
          {/* 菜单触发按钮 */}
          <MenuTrigger asChild p={2}>
            <Button
              data-testid="user-menu" // 测试标识
              variant="solid" // 实心按钮
              maxW="sm" // 最大宽度
              truncate // 文本截断
            >
              {/* 用户图标 */}
              <FaUserAstronaut fontSize="18" />

              {/* 用户名称（显示全名或默认"用户"） */}
              <Text>{user?.full_name || "用户"}</Text>
            </Button>
          </MenuTrigger>

          {/* 菜单内容 */}
          <MenuContent>
            {/* 个人资料菜单项 */}
            <Link to="/settings">
              <MenuItem
                closeOnSelect // 选择后关闭菜单
                value="user-settings" // 菜单项值
                gap={2} // 元素间距
                py={2} // 垂直内边距
                style={{ cursor: "pointer" }} // 鼠标指针样式
              >
                {/* 个人资料图标 */}
                <FiUser fontSize="18px" />

                {/* 菜单文本 */}
                <Box flex="1">个人资料</Box>
              </MenuItem>
            </Link>

            {/* 登出菜单项 */}
            <MenuItem
              value="logout" // 菜单项值
              gap={2} // 元素间距
              py={2} // 垂直内边距
              onClick={handleLogout} // 点击事件处理
              style={{ cursor: "pointer" }} // 鼠标指针样式
            >
              {/* 登出图标 */}
              <FiLogOut />

              {/* 菜单文本 */}
              退出登录
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </>
  )
}

export default UserMenu