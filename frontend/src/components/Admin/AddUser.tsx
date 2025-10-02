import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Flex,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { FaPlus } from "react-icons/fa"
import { type UserCreate, UsersService } from "@/client"
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
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"

/**
 * 用户创建表单类型
 *
 * 扩展了UserCreate类型，添加了确认密码字段
 */
interface UserCreateForm extends UserCreate {
  confirm_password: string
}

/**
 * 添加用户组件
 *
 * 提供一个对话框表单用于创建新用户
 */
const AddUser = () => {
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
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserCreateForm>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: false,
    },
  })

  // 创建用户Mutation
  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      // 创建成功处理
      showSuccessToast("用户创建成功")
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
  const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
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
        <Button value="add-user" my={4}>
          <FaPlus fontSize="16px" />
          添加用户
        </Button>
      </DialogTrigger>

      {/* 对话框内容 */}
      <DialogContent>
        {/* 表单容器 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>添加用户</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb={4}>
              填写以下表单以添加新用户到系统
            </Text>

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
                required
                invalid={!!errors.password}
                errorText={errors.password?.message}
                label="设置密码"
              >
                <Input
                  {...register("password", {
                    required: "密码是必填项",
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
                required
                invalid={!!errors.confirm_password}
                errorText={errors.confirm_password?.message}
                label="确认密码"
              >
                <Input
                  {...register("confirm_password", {
                    required: "请确认密码",
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
            <Button
              variant="solid"
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              保存
            </Button>
          </DialogFooter>
        </form>
        {/* 对话框关闭触发器 */}
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default AddUser