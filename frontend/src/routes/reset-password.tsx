import { Container, Heading, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock } from "react-icons/fi"

import { type ApiError, LoginService, type NewPassword } from "@/client"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { isLoggedIn } from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { confirmPasswordRules, handleError, passwordRules } from "@/utils"

/**
 * 新密码表单类型
 *
 * 扩展NewPassword类型，添加确认密码字段
 */
interface NewPasswordForm extends NewPassword {
  confirm_password: string
}

/**
 * 密码重置路由配置
 */
export const Route = createFileRoute("/reset-password")({
  component: ResetPassword, // 路由组件
  beforeLoad: async () => {
    // 路由加载前检查：如果用户已登录则重定向到首页
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

/**
 * 密码重置组件
 *
 * 提供密码重置表单，允许用户设置新密码
 */
function ResetPassword() {
  // 表单管理
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: {
      new_password: "", // 初始密码为空
    },
  })

  // 自定义Toast通知
  const { showSuccessToast } = useCustomToast()

  // 路由导航
  const navigate = useNavigate()

  /**
   * 密码重置API调用
   * @param data 新密码数据
   */
  const resetPassword = async (data: NewPassword) => {
    // 从URL查询参数获取token
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) return

    // 调用密码重置服务
    await LoginService.resetPassword({
      requestBody: {
        new_password: data.new_password,
        token: token
      },
    })
  }

  // 密码重置Mutation
  const mutation = useMutation({
    mutationFn: resetPassword, // 使用密码重置函数
    onSuccess: () => {
      // 成功处理
      showSuccessToast("密码更新成功。")
      reset() // 重置表单
      navigate({ to: "/login" }) // 导航到登录页
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
  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    mutation.mutate(data) // 触发密码重置
  }

  return (
    <Container
      as="form" // 渲染为表单
      onSubmit={handleSubmit(onSubmit)} // 表单提交处理
      h="100vh" // 全屏高度
      maxW="sm" // 最大宽度
      alignItems="stretch" // 拉伸子元素
      justifyContent="center" // 垂直居中
      gap={4} // 元素间距
      centerContent // 内容居中
    >
      {/* 标题 */}
      <Heading size="xl" color="ui.main" textAlign="center" mb={2}>
        重置密码
      </Heading>

      {/* 说明文本 */}
      <Text textAlign="center">
        请输入您的新密码并确认以重置密码。
      </Text>

      {/* 新密码输入框 */}
      <PasswordInput
        startElement={<FiLock />} // 锁图标
        type="new_password" // 字段类型
        errors={errors} // 错误信息
        {...register("new_password", passwordRules())} // 注册字段和验证规则
        placeholder="新密码" // 占位文本
      />

      {/* 确认密码输入框 */}
      <PasswordInput
        startElement={<FiLock />} // 锁图标
        type="confirm_password" // 字段类型
        errors={errors} // 错误信息
        {...register("confirm_password", confirmPasswordRules(getValues))} // 注册字段和验证规则
        placeholder="确认密码" // 占位文本
      />

      {/* 提交按钮 */}
      <Button variant="solid" type="submit">
        重置密码
      </Button>
    </Container>
  )
}
