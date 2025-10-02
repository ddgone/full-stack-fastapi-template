import { Container, Image, Input, Text } from "@chakra-ui/react"
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock, FiMail } from "react-icons/fi"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import Logo from "/assets/images/fastapi-logo.svg"
import { emailPattern, passwordRules } from "../utils"

// 创建登录路由配置
export const Route = createFileRoute("/login")({
  component: Login, // 指定路由渲染的组件
  beforeLoad: async () => {
    // 路由加载前的钩子：如果用户已登录则重定向到首页
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  // 使用认证钩子获取登录方法和状态
  const { loginMutation, error, resetError } = useAuth()

  // 使用 react-hook-form 管理表单状态
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur", // 在失去焦点时触发验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // 表单提交处理函数
  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return // 防止重复提交

    resetError() // 重置错误状态

    try {
      // 执行登录异步操作
      await loginMutation.mutateAsync(data)
    } catch {
      // 错误由 useAuth 钩子统一处理
    }
  }

  return (
    // 登录表单容器
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      h="100vh"
      maxW="sm"
      alignItems="stretch"
      justifyContent="center"
      gap={4}
      centerContent
    >
      {/* 应用Logo */}
      <Image
        src={Logo}
        alt="FastAPI logo"
        height="auto"
        maxW="2xs"
        alignSelf="center"
        mb={4}
      />

      {/* 邮箱输入字段 */}
      <Field
        invalid={!!errors.username}
        errorText={errors.username?.message || !!error}
      >
        <InputGroup w="100%" startElement={<FiMail />}>
          <Input
            {...register("username", {
              required: "用户名是必填项", // 必填验证
              pattern: emailPattern,     // 邮箱格式验证
            })}
            placeholder="邮箱"
            type="email"
          />
        </InputGroup>
      </Field>

      {/* 密码输入字段 */}
      <PasswordInput
        type="password"
        startElement={<FiLock />}
        {...register("password", passwordRules())} // 应用密码验证规则
        placeholder="密码"
        errors={errors}
      />

      {/* 忘记密码链接 */}
      <RouterLink to="/recover-password" className="main-link">
        忘记密码？
      </RouterLink>

      {/* 登录提交按钮 */}
      <Button variant="solid" type="submit" loading={isSubmitting} size="md">
        登录
      </Button>

      {/* 注册引导文本 */}
      <Text>
        还没有账号？{" "}
        <RouterLink to="/signup" className="main-link">
          注册
        </RouterLink>
      </Text>
    </Container>
  )
}