import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import { ItemsService } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"

/**
 * 删除项目组件
 *
 * 提供一个确认对话框用于删除指定项目
 *
 * @param id 要删除的项目ID
 */
const DeleteItem = ({ id }: { id: string }) => {
  // 对话框打开状态
  const [isOpen, setIsOpen] = useState(false)

  // 查询客户端实例
  const queryClient = useQueryClient()

  // 自定义Toast通知
  const { showSuccessToast, showErrorToast } = useCustomToast()

  // 表单管理（虽然不需要表单字段，但用于处理提交）
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  /**
   * 删除项目API调用
   * @param id 项目ID
   */
  const deleteItem = async (id: string) => {
    await ItemsService.deleteItem({ id })
  }

  // 删除项目Mutation
  const mutation = useMutation({
    mutationFn: deleteItem, // 使用删除函数
    onSuccess: () => {
      // 删除成功处理
      showSuccessToast("项目删除成功")
      setIsOpen(false) // 关闭对话框
    },
    onError: () => {
      // 错误处理
      showErrorToast("删除项目时发生错误")
    },
    onSettled: () => {
      // 无论成功失败都刷新项目列表
      queryClient.invalidateQueries()
    },
  })

  /**
   * 表单提交处理函数
   * 调用删除项目的Mutation
   */
  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }} // 响应式尺寸
      placement="center" // 居中显示
      role="alertdialog" // 警告对话框角色
      open={isOpen} // 控制打开状态
      onOpenChange={({ open }) => setIsOpen(open)} // 状态变化回调
    >
      {/* 对话框触发按钮 */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" colorPalette="red">
          <FiTrash2 fontSize="16px" />
          删除项目
        </Button>
      </DialogTrigger>

      {/* 对话框内容 */}
      <DialogContent>
        {/* 表单容器 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 对话框关闭触发器 */}
          <DialogCloseTrigger />

          <DialogHeader>
            <DialogTitle>删除项目</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb={4}>
              此项目将被<strong>永久删除</strong>。确定要删除吗？此操作不可撤销。
            </Text>
          </DialogBody>

          {/* 对话框底部操作按钮 */}
          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                取消
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="red"
              type="submit"
              loading={isSubmitting}
            >
              删除
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteItem