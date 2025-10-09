"use client" // 客户端组件指令

import { AbsoluteCenter, Menu as ChakraMenu, Portal } from "@chakra-ui/react"
import * as React from "react"
import { LuCheck, LuChevronRight } from "react-icons/lu" // 菜单图标

/**
 * 菜单内容组件属性
 *
 * @property portalled 是否使用Portal渲染（默认为true）
 * @property portalRef Portal容器引用
 */
interface MenuContentProps extends ChakraMenu.ContentProps {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
}

/**
 * 菜单内容组件
 *
 * 提供菜单的主要内容区域，支持Portal渲染
 */
export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props
    return (
      /* Portal容器（用于在DOM树外渲染） */
      <Portal
        disabled={!portalled} // 控制是否启用Portal
        container={portalRef} // Portal容器引用
      >
        {/* 菜单定位容器 */}
        <ChakraMenu.Positioner>
          {/* 菜单内容区域 */}
          <ChakraMenu.Content ref={ref} {...rest} />
        </ChakraMenu.Positioner>
      </Portal>
    )
  },
)

/**
 * 菜单箭头组件
 *
 * 提供菜单的指示箭头
 */
export const MenuArrow = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ArrowProps
>(function MenuArrow(props, ref) {
  return (
    <ChakraMenu.Arrow ref={ref} {...props}>
      {/* 箭头尖端 */}
      <ChakraMenu.ArrowTip />
    </ChakraMenu.Arrow>
  )
})

/**
 * 菜单复选框项组件
 *
 * 提供带复选框的菜单项
 */
export const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.CheckboxItemProps
>(function MenuCheckboxItem(props, ref) {
  return (
    <ChakraMenu.CheckboxItem
      ps="8" // 左侧内边距（为勾选图标留空间）
      ref={ref}
      {...props}
    >
      {/* 勾选图标（绝对居中） */}
      <AbsoluteCenter
        axis="horizontal" // 水平居中
        insetStart="4" // 左侧偏移
        asChild // 作为子元素渲染
      >
        <ChakraMenu.ItemIndicator>
          <LuCheck /> {/* 勾选图标 */}
        </ChakraMenu.ItemIndicator>
      </AbsoluteCenter>
      {props.children}
    </ChakraMenu.CheckboxItem>
  )
})

/**
 * 菜单单选按钮项组件
 *
 * 提供带单选按钮的菜单项
 */
export const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.RadioItemProps
>(function MenuRadioItem(props, ref) {
  const { children, ...rest } = props
  return (
    <ChakraMenu.RadioItem
      ps="8" // 左侧内边距（为勾选图标留空间）
      ref={ref}
      {...rest}
    >
      {/* 勾选图标（绝对居中） */}
      <AbsoluteCenter
        axis="horizontal" // 水平居中
        insetStart="4" // 左侧偏移
        asChild // 作为子元素渲染
      >
        <ChakraMenu.ItemIndicator>
          <LuCheck /> {/* 勾选图标 */}
        </ChakraMenu.ItemIndicator>
      </AbsoluteCenter>
      {/* 菜单项文本 */}
      <ChakraMenu.ItemText>{children}</ChakraMenu.ItemText>
    </ChakraMenu.RadioItem>
  )
})

/**
 * 菜单项分组组件
 *
 * 提供菜单项的分组功能
 */
export const MenuItemGroup = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ItemGroupProps
>(function MenuItemGroup(props, ref) {
  const { title, children, ...rest } = props
  return (
    <ChakraMenu.ItemGroup ref={ref} {...rest}>
      {/* 分组标题 */}
      {title && (
        <ChakraMenu.ItemGroupLabel
          userSelect="none" // 禁止文本选择
        >
          {title}
        </ChakraMenu.ItemGroupLabel>
      )}
      {children}
    </ChakraMenu.ItemGroup>
  )
})

/**
 * 菜单触发项组件属性
 *
 * @property startIcon 起始图标
 */
export interface MenuTriggerItemProps extends ChakraMenu.ItemProps {
  startIcon?: React.ReactNode
}

/**
 * 菜单触发项组件
 *
 * 提供带子菜单的菜单项
 */
export const MenuTriggerItem = React.forwardRef<
  HTMLDivElement,
  MenuTriggerItemProps
>(function MenuTriggerItem(props, ref) {
  const { startIcon, children, ...rest } = props
  return (
    <ChakraMenu.TriggerItem ref={ref} {...rest}>
      {/* 起始图标 */}
      {startIcon}
      {/* 菜单项文本 */}
      {children}
      {/* 右侧指示图标 */}
      <LuChevronRight />
    </ChakraMenu.TriggerItem>
  )
})

// 重新导出菜单的各个部分
export const MenuRadioItemGroup = ChakraMenu.RadioItemGroup // 单选按钮组
export const MenuContextTrigger = ChakraMenu.ContextTrigger // 上下文触发
export const MenuRoot = ChakraMenu.Root // 菜单根组件
export const MenuSeparator = ChakraMenu.Separator // 菜单分隔线

export const MenuItem = ChakraMenu.Item // 普通菜单项
export const MenuItemText = ChakraMenu.ItemText // 菜单项文本
export const MenuItemCommand = ChakraMenu.ItemCommand // 带快捷键的菜单项
export const MenuTrigger = ChakraMenu.Trigger // 菜单触发按钮