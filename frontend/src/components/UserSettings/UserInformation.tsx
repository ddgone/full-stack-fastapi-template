import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  type ApiError,
  type UserPublic,
  UsersService,
  type UserUpdateMe,
} from "@/client"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"
import { Field } from "../ui/field"

/**
 * 用户信息组件
 *
 * 显示和编辑当前登录用户的基本信息
 */
const UserInformation = () => {
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const [editMode, setEditMode] = useState(false) // 编辑模式状态
  const { user: currentUser } = useAuth() // 获取当前用户信息

  // 表单管理
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserPublic>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: {
      full_name: currentUser?.full_name, // 默认值：用户全名
      email: currentUser?.email, // 默认值：用户邮箱
    },
  })

  /**
   * 切换编辑模式
   */
  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  // 更新用户信息的Mutation
  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
      UsersService.updateUserMe({ requestBody: data }), // 调用更新用户API
    onSuccess: () => {
      showSuccessToast("用户信息更新成功") // 显示成功提示
    },
    onError: (err: ApiError) => {
      handleError(err) // 处理错误
    },
    onSettled: () => {
      queryClient.invalidateQueries() // 刷新所有查询
    },
  })

  /**
   * 表单提交处理函数
   * @param data 表单数据
   */
  const onSubmit: SubmitHandler<UserUpdateMe> = async (data) => {
    mutation.mutate(data) // 提交更新
  }

  /**
   * 取消编辑
   */
  const onCancel = () => {
    reset() // 重置表单
    toggleEditMode() // 退出编辑模式
  }

  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        用户信息
      </Heading>
      <Box
        w={{ sm: "full", md: "sm" }}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 全名字段 */}
        <Field label="姓名">
          {editMode ? (
            <Input
              {...register("full_name", { maxLength: 30 })}
              type="text"
              size="md"
            />
          ) : (
            <Text
              fontSize="md"
              py={2}
              color={!currentUser?.full_name ? "gray" : "inherit"}
              truncate
              maxW="sm"
            >
              {currentUser?.full_name || "未设置"}
            </Text>
          )}
        </Field>

        {/* 邮箱字段 */}
        <Field
          mt={4}
          label="邮箱"
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          {editMode ? (
            <Input
              {...register("email", {
                required: "邮箱是必填项",
                pattern: emailPattern,
              })}
              type="email"
              size="md"
            />
          ) : (
            <Text fontSize="md" py={2} truncate maxW="sm">
              {currentUser?.email}
            </Text>
          )}
        </Field>

        {/* 操作按钮 */}
        <Flex mt={4} gap={3}>
          <Button
            variant="solid"
            onClick={toggleEditMode}
            type={editMode ? "button" : "submit"}
            loading={editMode ? isSubmitting : false}
            disabled={editMode ? !isDirty || !getValues("email") : false}
          >
            {editMode ? "保存" : "编辑"}
          </Button>
          {editMode && (
            <Button
              variant="subtle"
              colorPalette="gray"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              取消
            </Button>
          )}
        </Flex>
      </Box>
    </Container>
  )
}

export default UserInformation
