import { Container, Heading, Tabs } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import Appearance from "@/components/UserSettings/Appearance"
import ChangePassword from "@/components/UserSettings/ChangePassword"
import DeleteAccount from "@/components/UserSettings/DeleteAccount"
import UserInformation from "@/components/UserSettings/UserInformation"
import useAuth from "@/hooks/useAuth"

/**
 * 选项卡配置
 *
 * 定义用户设置页面的各个选项卡
 */
const tabsConfig = [
  { value: "my-profile", title: "个人资料", component: UserInformation },
  { value: "password", title: "密码", component: ChangePassword },
  { value: "appearance", title: "外观", component: Appearance },
  { value: "danger-zone", title: "危险区域", component: DeleteAccount },
]

// 创建路由
export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings, // 用户设置组件
})

/**
 * 用户设置组件
 *
 * 提供用户设置界面，包含多个选项卡
 */
function UserSettings() {
  // 获取当前用户信息
  const { user: currentUser } = useAuth()

  /**
   * 最终显示的选项卡
   *
   * 如果是超级用户，显示所有选项卡
   * 否则，排除"危险区域"选项卡
   */
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig // 超级用户显示所有选项卡
    : tabsConfig.slice(0, 3) // 普通用户显示前三个选项卡

  // 如果未获取到用户信息，不渲染任何内容
  if (!currentUser) {
    return null
  }

  return (
    <Container maxW="full"> {/* 全宽容器 */}
      {/* 页面标题 */}
      <Heading
        size="lg" // 大号标题
        textAlign={{ base: "center", md: "left" }} // 响应式对齐
        py={12} // 垂直内边距
      >
        用户设置
      </Heading>

      {/* 选项卡组件 */}
      <Tabs.Root
        defaultValue="my-profile" // 默认选中的选项卡
        variant="subtle" // 微妙的视觉样式
      >
        {/* 选项卡列表 */}
        <Tabs.List>
          {finalTabs.map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value}>
              {tab.title} {/* 选项卡标题 */}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* 选项卡内容 */}
        {finalTabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            {/* 渲染对应的组件 */}
            <tab.component />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Container>
  )
}
