"use client" // 客户端组件指令

import type {
  ButtonProps,
  GroupProps,
  InputProps,
  StackProps,
} from "@chakra-ui/react"
import {
  Box,
  HStack,
  IconButton,
  Input,
  Stack,
  mergeRefs,
  useControllableState,
} from "@chakra-ui/react"
import { forwardRef, useRef } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi" // 眼睛图标
import { Field } from "./field" // 自定义字段组件
import { InputGroup } from "./input-group" // 自定义输入组组件

/**
 * 密码可见性控制属性
 *
 * @property defaultVisible 默认可见状态
 * @property visible 当前可见状态（受控）
 * @property onVisibleChange 可见状态变化回调
 * @property visibilityIcon 自定义可见/隐藏图标
 */
export interface PasswordVisibilityProps {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

/**
 * 密码输入框属性
 *
 * 扩展自Chakra InputProps并添加密码相关属性
 */
export interface PasswordInputProps
  extends InputProps,
    PasswordVisibilityProps {
  rootProps?: GroupProps // 根容器属性
  startElement?: React.ReactNode // 起始元素（如图标）
  type: string // 字段类型（用于错误处理）
  errors: any // 错误对象
}

/**
 * 密码输入框组件
 *
 * 提供带可见性切换功能的密码输入框
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    // 解构属性
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <FiEye />, off: <FiEyeOff /> }, // 默认图标
      startElement,
      type,
      errors,
      ...rest
    } = props

    // 密码可见性状态管理
    const [visible, setVisible] = useControllableState({
      value: visibleProp, // 受控值
      defaultValue: defaultVisible || false, // 默认值
      onChange: onVisibleChange, // 变化回调
    })

    // 输入框引用
    const inputRef = useRef<HTMLInputElement>(null)

    return (
      /* 字段容器（带错误处理） */
      <Field
        invalid={!!errors[type]} // 错误状态
        errorText={errors[type]?.message} // 错误文本
        alignSelf="start" // 对齐方式
      >
        {/* 输入组容器 */}
        <InputGroup
          width="100%" // 宽度
          startElement={startElement} // 起始元素
          endElement={
            /* 可见性切换按钮 */
            <VisibilityTrigger
              disabled={rest.disabled} // 禁用状态
              onPointerDown={(e) => {
                if (rest.disabled) return // 禁用时忽略
                if (e.button !== 0) return // 只响应主按钮点击
                e.preventDefault() // 阻止默认行为
                setVisible(!visible) // 切换可见性
              }}
            >
              {/* 根据可见性显示不同图标 */}
              {visible ? visibilityIcon.off : visibilityIcon.on}
            </VisibilityTrigger>
          }
          {...rootProps} // 传递根容器属性
        >
          {/* 密码输入框 */}
          <Input
            {...rest} // 传递其他属性
            ref={mergeRefs(ref, inputRef)} // 合并引用
            type={visible ? "text" : "password"} // 根据可见性切换类型
          />
        </InputGroup>
      </Field>
    )
  },
)

/**
 * 可见性切换按钮组件
 *
 * 提供密码可见性切换功能
 */
const VisibilityTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        tabIndex={-1} // 不可通过Tab键聚焦
        ref={ref}
        me="-2" // 右侧外边距
        aspectRatio="square" // 正方形比例
        size="sm" // 小尺寸
        variant="ghost" // 透明背景
        height="calc(100% - {spacing.2})" // 高度计算
        aria-label="切换密码可见性" // 无障碍标签（已翻译）
        color="inherit" // 继承颜色
        {...props} // 传递其他属性
      />
    )
  },
)

/**
 * 密码强度指示器属性
 *
 * @property max 最大强度值（默认4）
 * @property value 当前强度值
 */
interface PasswordStrengthMeterProps extends StackProps {
  max?: number
  value: number
}

/**
 * 密码强度指示器组件
 *
 * 显示密码强度级别
 */
export const PasswordStrengthMeter = forwardRef<
  HTMLDivElement,
  PasswordStrengthMeterProps
>(function PasswordStrengthMeter(props, ref) {
  const { max = 4, value, ...rest } = props

  // 计算强度百分比
  const percent = (value / max) * 100
  // 根据百分比获取颜色和标签
  const { label, colorPalette } = getColorPalette(percent)

  return (
    <Stack align="flex-end" gap="1" ref={ref} {...rest}>
      {/* 强度条容器 */}
      <HStack width="full" ref={ref} {...rest}>
        {/* 生成强度条 */}
        {Array.from({ length: max }).map((_, index) => (
          <Box
            key={index}
            height="1" // 高度
            flex="1" // 等宽
            rounded="sm" // 圆角
            data-selected={index < value ? "" : undefined} // 选中状态
            layerStyle="fill.subtle" // 填充样式
            colorPalette="gray" // 默认颜色
            _selected={{
              colorPalette, // 选中时颜色
              layerStyle: "fill.solid", // 选中时填充样式
            }}
          />
        ))}
      </HStack>
      {/* 强度标签 */}
      {label && <HStack textStyle="xs">{label}</HStack>}
    </Stack>
  )
})

/**
 * 根据强度百分比获取颜色和标签
 *
 * @param percent 强度百分比
 * @returns 颜色方案和标签
 */
function getColorPalette(percent: number) {
  switch (true) {
    case percent < 33:
      return { label: "弱", colorPalette: "red" } // 红色表示弱
    case percent < 66:
      return { label: "中", colorPalette: "orange" } // 橙色表示中等
    default:
      return { label: "强", colorPalette: "green" } // 绿色表示强
  }
}