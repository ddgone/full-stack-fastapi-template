import { Flex, Image, useBreakpointValue } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import Logo from "/assets/images/fastapi-logo.svg"
import UserMenu from "./UserMenu"

/**
 * 导航栏组件
 *
 * 提供网站顶部导航栏，包含Logo和用户菜单
 */
function Navbar() {
  // 响应式显示控制：在小屏幕上隐藏导航栏
  const display = useBreakpointValue({
    base: "none", // 小屏幕隐藏
    md: "flex"    // 中等及以上屏幕显示
  })

  return (
    <Flex
      display={display} // 响应式显示控制
      justify="space-between" // 左右两端对齐
      position="sticky" // 粘性定位
      color="white" // 文字颜色
      align="center" // 垂直居中
      bg="bg.muted" // 背景颜色
      w="100%" // 宽度100%
      top={0} // 顶部贴边
      p={4} // 内边距
    >
      {/* Logo链接（指向首页） */}
      <Link to="/">
        <Image
          src={Logo} // Logo图片
          alt="网站Logo" // 替代文本（已翻译）
          maxW="3xs" // 最大宽度
          p={2} // 内边距
        />
      </Link>

      {/* 右侧功能区 */}
      <Flex gap={2} alignItems="center">
        {/* 用户菜单组件 */}
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar