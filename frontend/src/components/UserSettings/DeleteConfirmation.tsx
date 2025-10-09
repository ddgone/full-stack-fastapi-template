import { Button, ButtonGroup, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { type ApiError, UsersService } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

/**
 * 账户删除确认组件
 *
 * 提供一个确认对话框用于用户删除自己的账户
 */
const DeleteConfirmation = () => {
  // 对话框打开状态
  const [isOpen, setIsOpen] = useState(false)

  // 查询客户端实例
  const queryClient = useQueryClient()

  // 自定义Toast通知
  const { showSuccessToast } = useCustomToast()

  // 表单管理（虽然不需要表单字段，但用于处理提交）
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  // 认证钩子（包含登出功能）
  const { logout } = useAuth()

  // 删除账户Mutation
  const mutation = useMutation({
    mutationFn: () => UsersService.deleteUserMe(), // 调用删除当前用户API
    onSuccess: () => {
      // 删除成功处理
      showSuccessToast("您的账户已成功删除")
      setIsOpen(false) // 关闭对话框
      logout() // 执行登出
    },
    onError: (err: ApiError) => {
      // 错误处理
      handleError(err)
    },
    onSettled: () => {
      // 无论成功失败都刷新当前用户信息
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    },
  })

  /**
   * 表单提交处理函数
   * 调用删除账户的Mutation
   */
  const onSubmit = async () => {
    mutation.mutate()
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }} // 响应式尺寸
      role="alertdialog" // 警告对话框角色
      placement="center" // 居中显示
      open={isOpen} // 控制打开状态
      onOpenChange={({ open }) => setIsOpen(open)} // 状态变化回调
    >
      {/* 对话框触发按钮 */}
      <DialogTrigger asChild>
        <Button variant="solid" colorPalette="red" mt={4}>
          删除账户
        </Button>
      </DialogTrigger>

      {/* 对话框内容 */}
      <DialogContent>
        {/* 表单容器 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 对话框关闭触发器 */}
          <DialogCloseTrigger />

          <DialogHeader>
            <DialogTitle>需要确认</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb={4}>
              您的所有账户数据将被<strong>永久删除</strong>。
              如果您确定要删除，请点击<strong>"确认删除"</strong>继续。
              此操作不可撤销。
            </Text>
          </DialogBody>

          {/* 对话框底部操作按钮 */}
          <DialogFooter gap={2}>
            <ButtonGroup>
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
                确认删除
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteConfirmation
