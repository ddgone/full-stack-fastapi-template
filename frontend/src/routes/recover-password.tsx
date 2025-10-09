import { Container, Heading, Input, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiMail } from "react-icons/fi"

import { type ApiError, LoginService } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { isLoggedIn } from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"

/**
 * 表单数据类型
 *
 * 定义密码恢复表单需要的字段
 */
interface FormData {
  email: string
}

/**
 * 创建密码恢复路由
 *
 * 在加载路由前检查用户是否已登录，如果已登录则重定向到首页
 */
export const Route = createFileRoute("/recover-password")({
  component: RecoverPassword, // 路由组件
  beforeLoad: async () => {
    // 如果用户已登录，重定向到首页
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

/**
 * 密码恢复组件
 *
 * 提供密码恢复功能，用户输入邮箱后发送重置链接
 */
function RecoverPassword() {
  // 表单管理
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  // 自定义Toast通知
  const { showSuccessToast } = useCustomToast()

  /**
   * 发送密码恢复请求
   * @param data 表单数据（包含邮箱）
   */
  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({
      email: data.email,
    })
  }

  // 密码恢复Mutation
  const mutation = useMutation({
    mutationFn: recoverPassword, // 使用恢复密码函数
    onSuccess: () => {
      // 成功处理
      showSuccessToast("密码重置邮件已发送成功")
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
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    mutation.mutate(data)
  }

  return (
    /* 表单容器 */
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
        密码恢复
      </Heading>

      {/* 说明文本 */}
      <Text textAlign="center">
        我们将向注册邮箱发送密码重置链接
      </Text>

      {/* 邮箱输入字段 */}
      <Field
        invalid={!!errors.email} // 错误状态
        errorText={errors.email?.message} // 错误消息
      >
        <InputGroup w="100%" startElement={<FiMail />}>
          <Input
            {...register("email", {
              required: "邮箱是必填项", // 必填验证
              pattern: emailPattern, // 邮箱格式验证
            })}
            placeholder="邮箱" // 占位文本
            type="email" // 输入类型
          />
        </InputGroup>
      </Field>

      {/* 提交按钮 */}
      <Button
        variant="solid" // 实心按钮
        type="submit" // 提交类型
        loading={isSubmitting} // 加载状态
      >
        继续
      </Button>
    </Container>
  )
}
