import { Checkbox as ChakraCheckbox } from "@chakra-ui/react"
import * as React from "react"

/**
 * 复选框组件属性
 *
 * @property icon 自定义图标（替代默认勾选图标）
 * @property inputProps 传递给隐藏input元素的属性
 * @property rootRef 根标签（label）的引用
 */
export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  rootRef?: React.Ref<HTMLLabelElement>
}

/**
 * 自定义复选框组件
 *
 * 在Chakra UI复选框基础上增加了自定义图标和引用传递功能
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    // 解构属性
    const { icon, children, inputProps, rootRef, ...rest } = props

    return (
      /* 复选框根元素（label标签） */
      <ChakraCheckbox.Root
        ref={rootRef} // 根标签引用
        {...rest} // 传递其他属性
      >
        {/* 隐藏的input元素（实际复选框） */}
        <ChakraCheckbox.HiddenInput
          ref={ref} // 转发ref到input元素
          {...inputProps} // 传递input属性
        />

        {/* 复选框视觉控制部分 */}
        <ChakraCheckbox.Control>
          {/* 显示自定义图标或默认勾选指示器 */}
          {icon || <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>

        {/* 复选框标签（如果有子元素） */}
        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    )
  },
)