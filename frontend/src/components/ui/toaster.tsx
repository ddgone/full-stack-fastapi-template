"use client" // 客户端组件指令

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

/**
 * 全局Toast管理器
 *
 * 配置：
 * - placement: "top-end" - 显示在右上角
 * - pauseOnPageIdle: true - 页面空闲时暂停显示
 */
export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
})

/**
 * Toast组件
 *
 * 提供全局的消息通知系统
 */
export const Toaster = () => {
  return (
    /* 使用Portal确保Toast显示在DOM树外层 */
    <Portal>
      {/* Toast容器 */}
      <ChakraToaster
        toaster={toaster} // 使用全局Toast管理器
        insetInline={{ mdDown: "4" }} // 响应式内边距
      >
        {/* 单个Toast项渲染函数 */}
        {(toast) => (
          /* Toast根容器 */
          <Toast.Root
            width={{ md: "sm" }} // 中等屏幕宽度为sm
            color={toast.meta?.color} // 自定义颜色
          >
            {/* 加载状态显示加载指示器 */}
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              /* 其他状态显示状态指示器 */
              <Toast.Indicator />
            )}

            {/* Toast内容区域 */}
            <Stack gap="1" flex="1" maxWidth="100%">
              {/* Toast标题 */}
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}

              {/* Toast描述 */}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>

            {/* 操作按钮 */}
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}

            {/* 关闭按钮（如果可关闭） */}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}