import { Container, Heading, Stack } from "@chakra-ui/react"
import { useTheme } from "next-themes" // 主题切换钩子

import { Radio, RadioGroup } from "@/components/ui/radio" // 自定义单选组件

/**
 * 外观设置组件
 *
 * 允许用户选择系统主题、亮色模式或暗色模式
 */
const Appearance = () => {
  // 使用主题切换钩子
  const { theme, setTheme } = useTheme()

  return (
    <Container maxW="full"> {/* 全宽容器 */}
      {/* 设置标题 */}
      <Heading size="sm" py={4}>
        外观设置
      </Heading>

      {/* 主题选择单选组 */}
      <RadioGroup
        onValueChange={(e) => setTheme(e.value ?? "system")} // 主题变更处理
        value={theme} // 当前选中的主题
        colorPalette="teal" // 青色主题
      >
        <Stack> {/* 垂直堆叠布局 */}
          {/* 系统主题选项 */}
          <Radio value="system">跟随系统</Radio>

          {/* 亮色模式选项 */}
          <Radio value="light">亮色模式</Radio>

          {/* 暗色模式选项 */}
          <Radio value="dark">暗色模式</Radio>
        </Stack>
      </RadioGroup>
    </Container>
  )
}

export default Appearance
