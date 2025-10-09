import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react"
import * as React from "react"

/**
 * 单选按钮组件属性
 *
 * @property rootRef 根元素引用
 * @property inputProps 隐藏input元素的属性
 */
export interface RadioProps extends ChakraRadioGroup.ItemProps {
  rootRef?: React.Ref<HTMLDivElement>
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

/**
 * 单选按钮组件
 *
 * 提供自定义的单选按钮实现
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    // 解构属性
    const { children, inputProps, rootRef, ...rest } = props

    return (
      /* 单选按钮项容器 */
      <ChakraRadioGroup.Item
        ref={rootRef} // 根元素引用
        {...rest} // 传递其他属性
      >
        {/* 隐藏的input元素（实际单选按钮） */}
        <ChakraRadioGroup.ItemHiddenInput
          ref={ref} // 转发ref到input元素
          {...inputProps} // 传递input属性
        />

        {/* 选中状态指示器 */}
        <ChakraRadioGroup.ItemIndicator />

        {/* 单选按钮文本标签 */}
        {children && (
          <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
        )}
      </ChakraRadioGroup.Item>
    )
  },
)

/**
 * 单选按钮组组件
 *
 * 用于包含和管理一组单选按钮
 */
export const RadioGroup = ChakraRadioGroup.Root
