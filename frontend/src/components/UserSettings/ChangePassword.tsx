import { Box, Button, Container, Heading, VStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock } from "react-icons/fi" // 锁图标

import { type ApiError, type UpdatePassword, UsersService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { confirmPasswordRules, handleError, passwordRules } from "@/utils"
import { PasswordInput } from "../ui/password-input"

/**
 * 更新密码表单类型
 *
 * 扩展了UpdatePassword类型，添加了确认密码字段
 */
interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string
}

/**
 * 修改密码组件
 *
 * 提供修改当前用户密码的功能
 */
const ChangePassword = () => {
  // 自定义Toast通知
  const { showSuccessToast } = useCustomToast()

  // 表单管理
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
  })

  // 更新密码Mutation
  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      // 更新成功处理
      showSuccessToast("密码更新成功")
      reset() // 重置表单
    },
    onError: (err: ApiError) => {
      // 错误处理
      handleError(err)
    },
  })

  /**
   * 表单提交处理函数
   * @param data 表单数据
   */
  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <Container maxW="full">
      {/* 标题 */}
      <Heading size="sm" py={4}>
        修改密码
      </Heading>

      {/* 表单容器 */}
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        {/* 表单字段组 */}
        <VStack gap={4} w={{ base: "100%", md: "sm" }}>
          {/* 当前密码输入框 */}
          <PasswordInput
            type="current_password"
            startElement={<FiLock />} // 锁图标
            {...register("current_password", passwordRules())} // 注册字段和验证规则
            placeholder="当前密码" // 占位文本
            errors={errors} // 错误信息
          />

          {/* 新密码输入框 */}
          <PasswordInput
            type="new_password"
            startElement={<FiLock />}
            {...register("new_password", passwordRules())}
            placeholder="新密码"
            errors={errors}
          />

          {/* 确认密码输入框 */}
          <PasswordInput
            type="confirm_password"
            startElement={<FiLock />}
            {...register("confirm_password", confirmPasswordRules(getValues))} // 使用确认密码验证规则
            placeholder="确认密码"
            errors={errors}
          />
        </VStack>

        {/* 提交按钮 */}
        <Button
          variant="solid" // 实心样式
          mt={4} // 上边距
          type="submit" // 提交类型
          loading={isSubmitting} // 加载状态
        >
          保存
        </Button>
      </Box>
    </Container>
  )
}

export default ChangePassword