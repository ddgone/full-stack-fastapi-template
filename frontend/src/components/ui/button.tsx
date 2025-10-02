import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import {
  AbsoluteCenter,
  Button as ChakraButton,
  Span,
  Spinner,
} from "@chakra-ui/react"
import * as React from "react"

/**
 * 按钮加载状态属性
 *
 * @property loading 是否显示加载状态
 * @property loadingText 加载状态下显示的文本
 */
interface ButtonLoadingProps {
  loading?: boolean
  loadingText?: React.ReactNode
}

/**
 * 自定义按钮属性
 *
 * 扩展了Chakra UI按钮属性并添加了加载状态相关属性
 */
export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {}

/**
 * 自定义按钮组件
 *
 * 在Chakra UI按钮基础上增加了加载状态处理
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    // 解构属性
    const { loading, disabled, loadingText, children, ...rest } = props

    return (
      <ChakraButton
        disabled={loading || disabled} // 加载或禁用时禁用按钮
        ref={ref} // 转发ref
        {...rest} // 传递其他属性
      >
        {/* 加载状态处理 */}
        {loading && !loadingText ? (
          // 情况1：显示加载指示器（无文本）
          <>
            {/* 绝对居中显示加载指示器 */}
            <AbsoluteCenter display="inline-flex">
              <Spinner size="inherit" color="inherit" />
            </AbsoluteCenter>
            {/* 隐藏原始文本（保留占位） */}
            <Span opacity={0}>{children}</Span>
          </>
        ) : loading && loadingText ? (
          // 情况2：显示加载指示器和加载文本
          <>
            <Spinner size="inherit" color="inherit" />
            {loadingText}
          </>
        ) : (
          // 情况3：正常显示子内容
          children
        )}
      </ChakraButton>
    )
  },
)