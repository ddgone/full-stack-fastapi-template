import {
  Button,
  DialogActionTrigger,
  DialogRoot,
  DialogTrigger,
  Flex,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { FaExchangeAlt } from "react-icons/fa"

import { type UserPublic, UsersService, type UserUpdate } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"
import { Checkbox } from "../ui/checkbox"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Field } from "../ui/field"

/**
 * 编辑用户组件属性
 *
 * @property user 要编辑的用户对象
 */
interface EditUserProps {
  user: UserPublic
}

/**
 * 用户更新表单类型
 *
 * 扩展了UserUpdate类型，添加了确认密码字段
 */
interface UserUpdateForm extends UserUpdate {
  confirm_password?: string
}

/**
 * 编辑用户组件
 *
 * 提供一个对话框表单用于编辑现有用户信息
 *
 * @param user 要编辑的用户对象
 */
const EditUser = ({ user }: EditUserProps) => {
  // 对话框打开状态
  const [isOpen, setIsOpen] = useState(false)

  // 查询客户端实例
  const queryClient = useQueryClient()

  // 自定义Toast通知
  const { showSuccessToast } = useCustomToast()

  // 表单管理
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdateForm>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: user, // 使用用户数据初始化表单
  })

  // 更新用户Mutation
  const mutation = useMutation({
    mutationFn: (data: UserUpdateForm) =>
      UsersService.updateUser({
        userId: user.id, // 用户ID
        requestBody: data // 更新数据
      }),
    onSuccess: () => {
      // 更新成功处理
      showSuccessToast("用户更新成功")
      reset() // 重置表单
      setIsOpen(false) // 关闭对话框
    },
    onError: (err: ApiError) => {
      // 错误处理
      handleError(err)
    },
    onSettled: () => {
      // 无论成功失败都刷新用户列表
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  /**
   * 表单提交处理函数
   * @param data 表单数据
   */
  const onSubmit: SubmitHandler<UserUpdateForm> = async (data) => {
    // 如果密码为空，则设为undefined（不更新密码）
    if (data.password === "") {
      data.password = undefined
    }
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }} // 响应式尺寸
      placement="center" // 居中显示
      open={isOpen} // 控制打开状态
      onOpenChange={({ open }) => setIsOpen(open)} // 状态变化回调
    >
      {/* 对话框触发按钮 */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FaExchangeAlt fontSize="16px" />
          编辑用户
        </Button>
      </DialogTrigger>

      {/* 对话框内容 */}
      <DialogContent>
        {/* 表单容器 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb={4}>请在下方更新用户信息</Text>

            {/* 表单字段组 */}
            <VStack gap={4}>
              {/* 邮箱字段 */}
              <Field
                required // 必填字段
                invalid={!!errors.email} // 错误状态
                errorText={errors.email?.message} // 错误消息
                label="邮箱" // 字段标签
              >
                <Input
                  {...register("email", {
                    required: "邮箱是必填项", // 必填验证
                    pattern: emailPattern, // 邮箱格式验证
                  })}
                  placeholder="邮箱" // 占位文本
                  type="email" // 输入类型
                />
              </Field>

              {/* 全名字段 */}
              <Field
                invalid={!!errors.full_name}
                errorText={errors.full_name?.message}
                label="全名"
              >
                <Input
                  {...register("full_name")}
                  placeholder="全名"
                  type="text"
                />
              </Field>

              {/* 密码字段 */}
              <Field
                invalid={!!errors.password}
                errorText={errors.password?.message}
                label="设置密码"
              >
                <Input
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "密码长度至少为8个字符",
                    },
                  })}
                  placeholder="密码"
                  type="password"
                />
              </Field>

              {/* 确认密码字段 */}
              <Field
                invalid={!!errors.confirm_password}
                errorText={errors.confirm_password?.message}
                label="确认密码"
              >
                <Input
                  {...register("confirm_password", {
                    validate: (value) =>
                      value === getValues().password ||
                      "两次输入的密码不匹配",
                  })}
                  placeholder="确认密码"
                  type="password"
                />
              </Field>
            </VStack>

            {/* 权限选项组 */}
            <Flex mt={4} direction="column" gap={4}>
              {/* 超级用户复选框 */}
              <Controller
                control={control}
                name="is_superuser"
                render={({ field }) => (
                  <Field disabled={field.disabled} colorPalette="teal">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                    >
                      是否为超级用户？
                    </Checkbox>
                  </Field>
                )}
              />

              {/* 激活状态复选框 */}
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <Field disabled={field.disabled} colorPalette="teal">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                    >
                      是否激活？
                    </Checkbox>
                  </Field>
                )}
              />
            </Flex>
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
            <Button variant="solid" type="submit" loading={isSubmitting}>
              保存
            </Button>
          </DialogFooter>

          {/* 对话框关闭触发器 */}
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default EditUser