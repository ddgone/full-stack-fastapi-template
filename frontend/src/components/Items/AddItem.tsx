import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FaPlus } from "react-icons/fa"

import { type ItemCreate, ItemsService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
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
 * 添加项目组件
 *
 * 提供一个对话框表单用于创建新项目
 */
const AddItem = () => {
  // 对话框打开状态
  const [isOpen, setIsOpen] = useState(false)

  // 查询客户端实例
  const queryClient = useQueryClient()

  // 自定义Toast通知
  const { showSuccessToast } = useCustomToast()

  // 表单管理
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ItemCreate>({
    mode: "onBlur", // 在失去焦点时验证
    criteriaMode: "all", // 验证所有规则
    defaultValues: {
      title: "",
      description: "",
    },
  })

  // 创建项目Mutation
  const mutation = useMutation({
    mutationFn: (data: ItemCreate) =>
      ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      // 创建成功处理
      showSuccessToast("项目创建成功")
      reset() // 重置表单
      setIsOpen(false) // 关闭对话框
    },
    onError: (err: ApiError) => {
      // 错误处理
      handleError(err)
    },
    onSettled: () => {
      // 无论成功失败都刷新项目列表
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  /**
   * 表单提交处理函数
   * @param data 表单数据
   */
  const onSubmit: SubmitHandler<ItemCreate> = (data) => {
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
        <Button value="add-item" my={4}>
          <FaPlus fontSize="16px" />
          添加项目
        </Button>
      </DialogTrigger>

      {/* 对话框内容 */}
      <DialogContent>
        {/* 表单容器 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>添加项目</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb={4}>填写以下信息以添加新项目</Text>

            {/* 表单字段组 */}
            <VStack gap={4}>
              {/* 标题字段 */}
              <Field
                required // 必填字段
                invalid={!!errors.title} // 错误状态
                errorText={errors.title?.message} // 错误消息
                label="标题" // 字段标签
              >
                <Input
                  {...register("title", {
                    required: "标题是必填项", // 必填验证
                  })}
                  placeholder="标题" // 占位文本
                  type="text" // 输入类型
                />
              </Field>

              {/* 描述字段 */}
              <Field
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label="描述"
              >
                <Input
                  {...register("description")}
                  placeholder="描述"
                  type="text"
                />
              </Field>
            </VStack>
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
              disabled={!isValid} // 表单无效时禁用
              loading={isSubmitting} // 提交中显示加载状态
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

export default AddItem