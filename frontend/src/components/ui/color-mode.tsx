"use client" // 客户端组件指令

import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu" // 月亮和太阳图标

/**
 * 颜色模式提供者属性
 *
 * 继承自next-themes的ThemeProviderProps
 */
export interface ColorModeProviderProps extends ThemeProviderProps {}

/**
 * 颜色模式提供者组件
 *
 * 封装next-themes的ThemeProvider，提供颜色模式切换功能
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class" // 使用class属性切换主题
      disableTransitionOnChange // 禁用切换时的过渡动画
      {...props} // 传递所有其他属性
    />
  )
}

/**
 * 颜色模式类型
 *
 * 定义支持的两种颜色模式：亮色和暗色
 */
export type ColorMode = "light" | "dark"

/**
 * 颜色模式Hook返回值
 *
 * 包含当前颜色模式和操作函数
 */
export interface UseColorModeReturn {
  colorMode: ColorMode // 当前颜色模式
  setColorMode: (colorMode: ColorMode) => void // 设置颜色模式
  toggleColorMode: () => void // 切换颜色模式
}

/**
 * 颜色模式Hook
 *
 * 提供颜色模式的状态和操作方法
 */
export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme()

  /**
   * 切换颜色模式
   */
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

/**
 * 颜色模式值Hook
 *
 * 根据当前颜色模式返回不同的值
 *
 * @param light 亮色模式下的值
 * @param dark 暗色模式下的值
 */
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

/**
 * 颜色模式图标组件
 *
 * 根据当前颜色模式显示太阳或月亮图标
 */
export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

/**
 * 颜色模式按钮属性
 *
 * 继承自IconButtonProps，排除aria-label属性
 */
interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

/**
 * 颜色模式切换按钮组件
 *
 * 提供切换亮色/暗色模式的功能
 */
export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()

  return (
    /* 仅在客户端渲染（避免SSR问题） */
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode} // 点击切换颜色模式
        variant="ghost" // 透明背景样式
        aria-label="切换颜色模式" // 无障碍标签（已翻译）
        size="sm" // 小尺寸
        ref={ref} // 转发ref
        {...props} // 传递其他属性
        css={{
          _icon: {
            width: "5", // 图标宽度
            height: "5", // 图标高度
          },
        }}
      >
        {/* 显示当前颜色模式对应的图标 */}
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

/**
 * 亮色模式容器组件
 *
 * 仅在亮色模式下显示其子元素
 */
export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg" // 前景色
        display="contents" // 内容显示方式
        className="chakra-theme light" // 亮色模式类名
        colorPalette="gray" // 颜色调色板
        colorScheme="light" // 颜色方案
        ref={ref} // 转发ref
        {...props} // 传递其他属性
      />
    )
  },
)

/**
 * 暗色模式容器组件
 *
 * 仅在暗色模式下显示其子元素
 */
export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg" // 前景色
        display="contents" // 内容显示方式
        className="chakra-theme dark" // 暗色模式类名
        colorPalette="gray" // 颜色调色板
        colorScheme="dark" // 颜色方案
        ref={ref} // 转发ref
        {...props} // 传递其他属性
      />
    )
  },
)