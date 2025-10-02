import type { ApiError } from "./client"
import useCustomToast from "./hooks/useCustomToast"

// 邮箱正则验证规则
export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // 邮箱格式正则表达式
  message: "电子邮件地址无效", // 验证失败提示信息
}

// 姓名正则验证规则
export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/, // 支持国际字符的姓名格式
  message: "名称无效", // 验证失败提示信息
}

/**
 * 密码验证规则生成器
 * @param isRequired 是否必填（默认为true）
 * @returns 密码验证规则对象
 */
export const passwordRules = (isRequired = true) => {
  const rules: any = {
    minLength: {
      value: 8, // 最小长度要求
      message: "密码必须至少为 8 个字符", // 验证失败提示
    },
  }

  // 添加必填验证规则
  if (isRequired) {
    rules.required = "密码是必填项"
  }

  return rules
}

/**
 * 确认密码验证规则生成器
 * @param getValues 获取表单值的方法
 * @param isRequired 是否必填（默认为true）
 * @returns 确认密码验证规则对象
 */
export const confirmPasswordRules = (
  getValues: () => any,
  isRequired = true,
) => {
  const rules: any = {
    // 自定义验证：确认密码必须与密码一致
    validate: (value: string) => {
      // 获取密码字段值（支持password和new_password两种字段名）
      const password = getValues().password || getValues().new_password
      return value === password ? true : "密码不匹配"
    },
  }

  // 添加必填验证规则
  if (isRequired) {
    rules.required = "确认密码是必填项"
  }

  return rules
}

/**
 * 统一处理API错误
 * @param err API错误对象
 */
export const handleError = (err: ApiError) => {
  const {showErrorToast} = useCustomToast() // 获取自定义提示方法

  // 尝试从错误响应中提取详细信息
  const errDetail = (err.body as any)?.detail

  // 默认错误消息
  let errorMessage = errDetail || "出错了。"

  // 处理数组形式的错误详情（常见于表单验证错误）
  if (Array.isArray(errDetail) && errDetail.length > 0) {
    // 提取第一条错误消息
    errorMessage = errDetail[0].msg
  }

  // 显示错误提示
  showErrorToast(errorMessage)
}