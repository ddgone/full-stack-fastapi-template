import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiRequestOptions } from './ApiRequestOptions';

/** 请求头类型，键值对形式 */
type Headers = Record<string, string>;

/** 中间件函数类型 */
type Middleware<T> = (value: T) => T | Promise<T>;

/** 解析器函数类型 */
type Resolver<T> = (options: ApiRequestOptions<T>) => Promise<T>;

/**
 * 拦截器管理类
 *
 * 用于管理请求/响应的中间件函数
 *
 * @template T 中间件处理的类型
 */
export class Interceptors<T> {
  /** 存储中间件函数的数组 */
  _fns: Middleware<T>[];

  constructor() {
    this._fns = []; // 初始化空数组
  }

  /**
   * 移除已注册的中间件
   * @param fn 要移除的中间件函数
   */
  eject(fn: Middleware<T>): void {
    const index = this._fns.indexOf(fn);
    if (index !== -1) {
      // 创建新数组排除要移除的函数
      this._fns = [...this._fns.slice(0, index), ...this._fns.slice(index + 1)];
    }
  }

  /**
   * 注册中间件函数
   * @param fn 要添加的中间件函数
   */
  use(fn: Middleware<T>): void {
    // 将新函数添加到数组末尾
    this._fns = [...this._fns, fn];
  }
}

/**
 * OpenAPI配置类型
 *
 * 定义与OpenAPI规范兼容的客户端配置
 */
export type OpenAPIConfig = {
  /** API基础路径 */
  BASE: string;

  /** 凭证处理方式 */
  CREDENTIALS: 'include' | 'omit' | 'same-origin';

  /** 路径编码函数 */
  ENCODE_PATH?: ((path: string) => string) | undefined;

  /**
   * 请求头配置：
   * - 可以是静态对象
   * - 可以是解析函数
   */
  HEADERS?: Headers | Resolver<Headers> | undefined;

  /** 密码（静态值或解析函数） */
  PASSWORD?: string | Resolver<string> | undefined;

  /** 访问令牌（静态值或解析函数） */
  TOKEN?: string | Resolver<string> | undefined;

  /** 用户名（静态值或解析函数） */
  USERNAME?: string | Resolver<string> | undefined;

  /** API版本号 */
  VERSION: string;

  /** 是否携带凭证 */
  WITH_CREDENTIALS: boolean;

  /** 拦截器配置 */
  interceptors: {
    /** 请求拦截器，处理Axios请求配置 */
    request: Interceptors<AxiosRequestConfig>;
    /** 响应拦截器，处理Axios响应对象 */
    response: Interceptors<AxiosResponse>;
  };
};

/**
 * 默认OpenAPI配置
 *
 * 提供全局共享的API配置实例
 */
export const OpenAPI: OpenAPIConfig = {
  BASE: '', // 基础路径默认为空
  CREDENTIALS: 'include', // 默认包含凭证
  ENCODE_PATH: undefined, // 无默认路径编码
  HEADERS: undefined, // 无默认请求头
  PASSWORD: undefined, // 无默认密码
  TOKEN: undefined, // 无默认令牌
  USERNAME: undefined, // 无默认用户名
  VERSION: '0.1.0', // 默认API版本
  WITH_CREDENTIALS: false, // 默认不携带凭证
  interceptors: {
    // 初始化请求拦截器
    request: new Interceptors(),
    // 初始化响应拦截器
    response: new Interceptors(),
  },
};