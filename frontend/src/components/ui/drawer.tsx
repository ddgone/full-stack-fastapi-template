import { Drawer as ChakraDrawer, Portal } from "@chakra-ui/react"
import * as React from "react"
import { CloseButton } from "./close-button" // 自定义关闭按钮

/**
 * 抽屉内容组件属性
 *
 * @property portalled 是否使用Portal渲染（默认为true）
 * @property portalRef Portal容器引用
 * @property offset 抽屉偏移量（用于调整位置）
 */
interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  offset?: ChakraDrawer.ContentProps["padding"]
}

/**
 * 抽屉内容组件
 *
 * 提供抽屉的主要内容区域，支持Portal渲染和位置偏移
 */
export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(function DrawerContent(props, ref) {
  // 解构属性
  const {
    children,
    portalled = true, // 默认使用Portal
    portalRef,
    offset, // 位置偏移量
    ...rest
  } = props

  return (
    /* Portal容器（用于在DOM树外渲染） */
    <Portal
      disabled={!portalled} // 控制是否启用Portal
      container={portalRef} // Portal容器引用
    >
      {/* 抽屉定位容器（支持偏移量） */}
      <ChakraDrawer.Positioner padding={offset}>
        {/* 抽屉内容区域 */}
        <ChakraDrawer.Content
          ref={ref} // 转发ref
          {...rest} // 传递其他属性
          asChild={false} // 不使用子元素模式
        >
          {children}
        </ChakraDrawer.Content>
      </ChakraDrawer.Positioner>
    </Portal>
  )
})

/**
 * 抽屉关闭触发器组件
 *
 * 提供统一的关闭按钮样式和位置
 */
export const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  return (
    <ChakraDrawer.CloseTrigger
      position="absolute" // 绝对定位
      top="2" // 顶部距离
      insetEnd="2" // 右侧距离（RTL兼容）
      {...props} // 传递其他属性
      asChild // 使用子元素作为触发器
    >
      {/* 自定义关闭按钮 */}
      <CloseButton
        size="sm" // 小尺寸
        ref={ref} // 转发ref
      />
    </ChakraDrawer.CloseTrigger>
  )
})

// 重新导出抽屉的各个部分
export const DrawerTrigger = ChakraDrawer.Trigger // 抽屉触发按钮
export const DrawerRoot = ChakraDrawer.Root // 抽屉根组件
export const DrawerFooter = ChakraDrawer.Footer // 抽屉底部区域
export const DrawerHeader = ChakraDrawer.Header // 抽屉头部区域
export const DrawerBody = ChakraDrawer.Body // 抽屉主体区域
export const DrawerBackdrop = ChakraDrawer.Backdrop // 抽屉背景遮罩
export const DrawerDescription = ChakraDrawer.Description // 抽屉描述
export const DrawerTitle = ChakraDrawer.Title // 抽屉标题
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger // 抽屉操作按钮