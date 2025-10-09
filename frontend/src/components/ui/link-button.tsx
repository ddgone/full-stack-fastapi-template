"use client" // 客户端组件指令

import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react"
import { createRecipeContext } from "@chakra-ui/react"

/**
 * 链接按钮组件属性
 *
 * 继承自Chakra的HTML属性和按钮配方属性
 */
export interface LinkButtonProps
  extends HTMLChakraProps<"a", RecipeProps<"button">> {}

/**
 * 创建按钮配方上下文
 *
 * 使用按钮样式配方创建上下文
 */
const { withContext } = createRecipeContext({
  key: "button" // 使用按钮样式配方
})

/**
 * 链接按钮组件
 *
 * 将链接(<a>)渲染为按钮样式的组件
 *
 * 注意：实际项目中应替换为框架特定的链接组件（如Next.js的Link）
 */
export const LinkButton = withContext<HTMLAnchorElement, LinkButtonProps>(
  "a" // 使用<a>标签作为基础元素
)