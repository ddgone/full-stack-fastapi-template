/// <reference types="vite/client" /> // Vite客户端类型引用

/**
 * 环境变量接口
 *
 * 定义Vite环境变量的类型声明
 */
interface ImportMetaEnv {
  /**
   * API基础URL
   *
   * 用于配置应用访问的后端API地址
   * 示例: "https://api.example.com/v1"
   */
  readonly VITE_API_URL: string
}

/**
 * 导入元数据接口
 *
 * 提供访问环境变量的入口
 */
interface ImportMeta {
  /**
   * 环境变量对象
   *
   * 包含所有通过Vite定义的环境变量
   */
  readonly env: ImportMetaEnv
}