import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "@/client"
import { handleError } from "@/utils"

/**
 * 检查用户是否已登录
 *
 * 通过检查localStorage中是否存在访问令牌来判断
 */
const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

/**
 * 认证钩子
 *
 * 提供用户认证相关的状态和操作（登录、注册、登出）
 */
const useAuth = () => {
  // 错误状态
  const [error, setError] = useState<string | null>(null)

  // 路由导航
  const navigate = useNavigate()

  // 查询客户端
  const queryClient = useQueryClient()

  /**
   * 获取当前用户信息
   *
   * 仅在用户已登录时执行查询
   */
  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"], // 查询键
    queryFn: UsersService.readUserMe, // 查询函数（获取当前用户）
    enabled: isLoggedIn(), // 仅在已登录时启用
  })

  /**
   * 注册用户Mutation
   */
  const signUpMutation = useMutation({
    // 注册用户API调用
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    // 注册成功处理
    onSuccess: () => {
      navigate({ to: "/login" }) // 导航到登录页
    },

    // 错误处理
    onError: (err: ApiError) => {
      handleError(err) // 处理错误
    },

    // 完成后处理
    onSettled: () => {
      // 刷新用户列表
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  /**
   * 登录函数
   *
   * @param data 登录凭证
   */
  const login = async (data: AccessToken) => {
    // 调用登录API
    const response = await LoginService.loginAccessToken({
      formData: data,
    })
    // 存储访问令牌
    localStorage.setItem("access_token", response.access_token)
  }

  /**
   * 登录Mutation
   */
  const loginMutation = useMutation({
    mutationFn: login, // 使用登录函数
    onSuccess: () => {
      navigate({ to: "/" }) // 登录成功后导航到首页
    },
    onError: (err: ApiError) => {
      handleError(err) // 处理错误
    },
  })

  /**
   * 登出函数
   */
  const logout = () => {
    // 移除访问令牌
    localStorage.removeItem("access_token")
    // 导航到登录页
    navigate({ to: "/login" })
  }

  // 返回认证相关的状态和操作
  return {
    signUpMutation, // 注册Mutation
    loginMutation, // 登录Mutation
    logout, // 登出函数
    user, // 当前用户信息
    error, // 错误信息
    resetError: () => setError(null), // 重置错误
  }
}

// 导出辅助函数
export { isLoggedIn }

// 导出认证钩子
export default useAuth
