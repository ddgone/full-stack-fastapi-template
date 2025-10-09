import { Container, Flex, Image, Input, Text } from "@chakra-ui/react"
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock, FiUser } from "react-icons/fi"

import type { UserRegister } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { confirmPasswordRules, emailPattern, passwordRules } from "@/utils"
import Logo from "/assets/images/fastapi-logo.svg"

/**
 * 注册页面路由配置
 */
export const Route = createFileRoute("/signup")({
  component: SignUp, // 注册页面组件
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
 * 用户注册表单类型
 *
 * 扩展用户注册信息，添加确认密码字段
 */
interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

/**
 * 注册页面组件
 *
 * 提供用户注册功能
 */
function SignUp() {
  // 使用认证钩子获取注册方法
  const { signUpMutation } = useAuth()

  // 表单管理
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  })

  /**
   * 表单提交处理函数
   * @param data 表单数据
   */
  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data) // 执行注册操作
  }

  return (
    <Flex
      flexDir={{ base: "column", md: "row" }} // 响应式布局
      justify="center" // 水平居中
      h="100vh" // 全屏高度
    >
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
        {/* 应用Logo */}
        <Image
          src={Logo}
          alt="FastAPI logo"
          height="auto"
          maxW="2xs" // 最大宽度
          alignSelf="center" // 自身居中
          mb={4} // 底部外边距
        />

        {/* 全名字段 */}
        <Field
          invalid={!!errors.full_name} // 错误状态
          errorText={errors.full_name?.message} // 错误消息
        >
          <InputGroup w="100%" startElement={<FiUser />}>
            <Input
              minLength={3} // 最小长度
              {...register("full_name", {
                required: "姓名是必填项", // 必填验证
              })}
              placeholder="姓名" // 占位文本
              type="text"
            />
          </InputGroup>
        </Field>

        {/* 邮箱字段 */}
        <Field invalid={!!errors.email} errorText={errors.email?.message}>
          <InputGroup w="100%" startElement={<FiUser />}>
            <Input
              {...register("email", {
                required: "邮箱是必填项", // 必填验证
                pattern: emailPattern, // 邮箱格式验证
              })}
              placeholder="邮箱" // 占位文本
              type="email"
            />
          </InputGroup>
        </Field>

        {/* 密码字段 */}
        <PasswordInput
          type="password"
          startElement={<FiLock />}
          {...register("password", passwordRules())} // 密码验证规则
          placeholder="密码" // 占位文本
          errors={errors}
        />

        {/* 确认密码字段 */}
        <PasswordInput
          type="confirm_password"
          startElement={<FiLock />}
          {...register("confirm_password", confirmPasswordRules(getValues))} // 确认密码验证规则
          placeholder="确认密码" // 占位文本
          errors={errors}
        />

        {/* 注册按钮 */}
        <Button variant="solid" type="submit" loading={isSubmitting}>
          注册
        </Button>

        {/* 登录链接 */}
        <Text>
          已有账号？{" "}
          <RouterLink to="/login" className="main-link">
            登录
          </RouterLink>
        </Text>
      </Container>
    </Flex>
  )
}

export default SignUp
