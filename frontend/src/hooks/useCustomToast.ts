"use client" // 客户端组件指令

import { toaster } from "@/components/ui/toaster" // 导入Toast组件

/**
 * 自定义Toast钩子
 *
 * 提供显示成功和错误Toast的方法
 */
const useCustomToast = () => {
  /**
   * 显示成功Toast
   * @param description Toast描述内容
   */
  const showSuccessToast = (description: string) => {
    toaster.create({
      title: "操作成功！", // 成功标题
      description, // 成功描述
      type: "success", // 成功类型
    })
  }

  /**
   * 显示错误Toast
   * @param description Toast描述内容
   */
  const showErrorToast = (description: string) => {
    toaster.create({
      title: "出错了！", // 错误标题
      description, // 错误描述
      type: "error", // 错误类型
    })
  }

  // 返回两个Toast方法
  return { showSuccessToast, showErrorToast }
}

export default useCustomToast