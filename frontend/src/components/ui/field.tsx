import { Field as ChakraField } from "@chakra-ui/react"
import * as React from "react"

/**
 * 表单字段组件属性
 *
 * @property label 字段标签
 * @property helperText 帮助文本
 * @property errorText 错误文本
 * @property optionalText 非必填字段提示文本
 */
export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  optionalText?: React.ReactNode
}

/**
 * 表单字段组件
 *
 * 提供完整的表单字段解决方案，包含标签、帮助文本、错误提示等功能
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    // 解构属性
    const {
      label,
      children,
      helperText,
      errorText,
      optionalText,
      ...rest
    } = props

    return (
      /* 字段根容器 */
      <ChakraField.Root
        ref={ref} // 转发ref
        {...rest} // 传递其他属性
      >
        {/* 字段标签区域 */}
        {label && (
          <ChakraField.Label>
            {/* 主标签文本 */}
            {label}

            {/* 必填/非必填指示器 */}
            <ChakraField.RequiredIndicator
              fallback={optionalText} // 非必填时显示optionalText
            />
          </ChakraField.Label>
        )}

        {/* 字段内容（通常是输入控件） */}
        {children}

        {/* 帮助文本（表单说明） */}
        {helperText && (
          <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
        )}

        {/* 错误文本（表单验证错误） */}
        {errorText && (
          <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    )
  },
)