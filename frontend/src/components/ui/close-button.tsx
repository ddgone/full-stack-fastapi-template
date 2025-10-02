import type { ButtonProps } from "@chakra-ui/react"
import { IconButton as ChakraIconButton } from "@chakra-ui/react"
import * as React from "react"
import { LuX } from "react-icons/lu" // 关闭图标

/**
 * 关闭按钮组件属性
 *
 * 继承自Chakra UI的ButtonProps
 */
export type CloseButtonProps = ButtonProps

/**
 * 关闭按钮组件
 *
 * 提供一个通用的关闭按钮，使用X图标作为默认显示
 */
export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ChakraIconButton
      variant="ghost" // 透明背景样式
      aria-label="关闭" // 无障碍标签（已翻译）
      ref={ref} // 转发ref
      {...props} // 传递所有其他属性
    >
      {/* 如果提供了子元素则显示，否则显示默认关闭图标 */}
      {props.children ?? <LuX />}
    </ChakraIconButton>
  )
})