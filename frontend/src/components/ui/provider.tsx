"use client" // 客户端组件指令

import { ChakraProvider } from "@chakra-ui/react"
import { type PropsWithChildren } from "react"
import { system } from "../../theme" // 自定义主题系统
import { ColorModeProvider } from "./color-mode" // 颜色模式提供者
import { Toaster } from "./toaster" // 消息提示组件

/**
 * 自定义提供者组件
 *
 * 封装应用所需的所有上下文提供者
 *
 * @param props
 */
export function CustomProvider(props: PropsWithChildren) {
  return (
    /* Chakra UI提供者 */
    <ChakraProvider value={system}>
      {/* 颜色模式提供者（默认亮色主题） */}
      <ColorModeProvider defaultTheme="light">
        {props.children}
      </ColorModeProvider>

      {/* 全局消息提示组件 */}
      <Toaster />
    </ChakraProvider>
  )
}
