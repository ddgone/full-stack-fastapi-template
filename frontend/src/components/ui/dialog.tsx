import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react"
import * as React from "react"
import { CloseButton } from "./close-button" // 自定义关闭按钮

/**
 * 对话框内容组件属性
 *
 * @property portalled 是否使用Portal渲染（默认为true）
 * @property portalRef Portal容器引用
 * @property backdrop 是否显示背景遮罩（默认为true）
 */
interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  backdrop?: boolean
}

/**
 * 对话框内容组件
 *
 * 提供对话框的主要内容区域，支持Portal渲染和背景遮罩
 */
export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(props, ref) {
  // 解构属性
  const {
    children,
    portalled = true, // 默认使用Portal
    portalRef,
    backdrop = true, // 默认显示背景遮罩
    ...rest
  } = props

  return (
    /* Portal容器（用于在DOM树外渲染） */
    <Portal
      disabled={!portalled} // 控制是否启用Portal
      container={portalRef} // Portal容器引用
    >
      {/* 背景遮罩（可选） */}
      {backdrop && <ChakraDialog.Backdrop />}

      {/* 对话框定位容器 */}
      <ChakraDialog.Positioner>
        {/* 对话框内容区域 */}
        <ChakraDialog.Content
          ref={ref} // 转发ref
          {...rest} // 传递其他属性
          asChild={false} // 不使用子元素模式
        >
          {children}
        </ChakraDialog.Content>
      </ChakraDialog.Positioner>
    </Portal>
  )
})

/**
 * 对话框关闭触发器组件
 *
 * 提供统一的关闭按钮样式和位置
 */
export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
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
      >
        {props.children}
      </CloseButton>
    </ChakraDialog.CloseTrigger>
  )
})

// 重新导出对话框的各个部分
export const DialogRoot = ChakraDialog.Root // 对话框根组件
export const DialogFooter = ChakraDialog.Footer // 对话框底部区域
export const DialogHeader = ChakraDialog.Header // 对话框头部区域
export const DialogBody = ChakraDialog.Body // 对话框主体区域
export const DialogBackdrop = ChakraDialog.Backdrop // 对话框背景遮罩
export const DialogTitle = ChakraDialog.Title // 对话框标题
export const DialogDescription = ChakraDialog.Description // 对话框描述
export const DialogTrigger = ChakraDialog.Trigger // 对话框触发按钮
export const DialogActionTrigger = ChakraDialog.ActionTrigger // 对话框操作按钮