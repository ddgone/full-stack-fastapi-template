import type { BoxProps, InputElementProps } from "@chakra-ui/react"
import { Group, InputElement } from "@chakra-ui/react"
import * as React from "react"

/**
 * 输入组组件属性
 *
 * @property startElementProps 起始元素属性
 * @property endElementProps 结束元素属性
 * @property startElement 起始元素（如图标）
 * @property endElement 结束元素（如图标）
 * @property children 输入元素（必须是单个Input组件）
 * @property startOffset 起始元素偏移量（默认"6px"）
 * @property endOffset 结束元素偏移量（默认"6px"）
 */
export interface InputGroupProps extends BoxProps {
  startElementProps?: InputElementProps
  endElementProps?: InputElementProps
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  children: React.ReactElement<InputElementProps>
  startOffset?: InputElementProps["paddingStart"]
  endOffset?: InputElementProps["paddingEnd"]
}

/**
 * 输入组组件
 *
 * 在输入框前后添加附加元素（如图标、按钮等）
 */
export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    // 解构属性
    const {
      startElement, // 起始元素（如搜索图标）
      startElementProps, // 起始元素属性
      endElement, // 结束元素（如清除按钮）
      endElementProps, // 结束元素属性
      children, // 输入元素（必须是单个Input组件）
      startOffset = "6px", // 起始元素偏移量（默认6像素）
      endOffset = "6px", // 结束元素偏移量（默认6像素）
      ...rest // 其他属性
    } = props

    // 确保只有一个子元素（输入框）
    const child =
      React.Children.only<React.ReactElement<InputElementProps>>(children)

    return (
      /* 输入组容器 */
      <Group ref={ref} {...rest}>
        {/* 起始元素（如前置图标） */}
        {startElement && (
          <InputElement
            pointerEvents="none" // 禁止鼠标事件穿透
            {...startElementProps} // 传递属性
          >
            {startElement}
          </InputElement>
        )}

        {/* 克隆输入元素并添加内边距 */}
        {React.cloneElement(child, {
          // 如果存在起始元素，添加左侧内边距
          ...(startElement && {
            ps: `calc(var(--input-height) - ${startOffset})`,
          }),
          // 如果存在结束元素，添加右侧内边距
          ...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
          // 保留原始属性
          ...children.props,
        })}

        {/* 结束元素（如后置图标） */}
        {endElement && (
          <InputElement
            placement="end" // 放置在结束位置
            {...endElementProps} // 传递属性
          >
            {endElement}
          </InputElement>
        )}
      </Group>
    )
  },
)