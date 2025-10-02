import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

/**
 * 检查值是否为字符串
 * @param value 要检查的值
 * @returns 是否为字符串
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * 检查值是否为非空字符串
 * @param value 要检查的值
 * @returns 是否为非空字符串
 */
export const isStringWithValue = (value: unknown): value is string => {
  return isString(value) && value !== '';
};

/**
 * 检查值是否为Blob对象
 * @param value 要检查的值
 * @returns 是否为Blob
 */
export const isBlob = (value: any): value is Blob => {
  return value instanceof Blob;
};

/**
 * 检查值是否为FormData对象
 * @param value 要检查的值
 * @returns 是否为FormData
 */
export const isFormData = (value: unknown): value is FormData => {
  return value instanceof FormData;
};

/**
 * 检查HTTP状态码是否表示成功（200-299）
 * @param status HTTP状态码
 * @returns 是否成功
 */
export const isSuccess = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Base64编码字符串
 * @param str 要编码的字符串
 * @returns Base64编码结果
 */
export const base64 = (str: string): string => {
  try {
    return btoa(str); // 浏览器环境
  } catch (err) {
    // Node.js环境
    // @ts-ignore
    return Buffer.from(str).toString('base64');
  }
};

/**
 * 将对象转换为查询字符串
 * @param params 查询参数对象
 * @returns 查询字符串
 */
export const getQueryString = (params: Record<string, unknown>): string => {
  const qs: string[] = []; // 存储键值对的数组

  /**
   * 添加键值对到查询字符串数组
   * @param key 键名
   * @param value 键值
   */
  const append = (key: string, value: unknown) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  /**
   * 递归处理键值对
   * @param key 键名
   * @param value 键值
   */
  const encodePair = (key: string, value: unknown) => {
    // 忽略undefined和null
    if (value === undefined || value === null) {
      return;
    }

    // 处理日期类型
    if (value instanceof Date) {
      append(key, value.toISOString());
    }
    // 处理数组类型
    else if (Array.isArray(value)) {
      value.forEach(v => encodePair(key, v));
    }
    // 处理对象类型
    else if (typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => encodePair(`${key}[${k}]`, v));
    }
    // 处理基本类型
    else {
      append(key, value);
    }
  };

  // 处理所有参数
  Object.entries(params).forEach(([key, value]) => encodePair(key, value));

  // 返回查询字符串（如果有参数）
  return qs.length ? `?${qs.join('&')}` : '';
};

/**
 * 获取完整URL
 * @param config OpenAPI配置
 * @param options 请求选项
 * @returns 完整URL
 */
const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  // 使用配置的路径编码函数或默认的encodeURI
  const encoder = config.ENCODE_PATH || encodeURI;

  // 替换路径中的占位符
  const path = options.url
    .replace('{api-version}', config.VERSION) // 替换API版本
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      // 替换路径参数
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });

  // 拼接基础路径和查询字符串
  const url = config.BASE + path;
  return options.query ? url + getQueryString(options.query) : url;
};

/**
 * 获取FormData对象
 * @param options 请求选项
 * @returns FormData对象或undefined
 */
export const getFormData = (options: ApiRequestOptions): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData();

    /**
     * 处理单个键值对
     * @param key 键名
     * @param value 键值
     */
    const process = (key: string, value: unknown) => {
      // 处理字符串和Blob
      if (isString(value) || isBlob(value)) {
        formData.append(key, value);
      }
      // 处理其他类型（转换为JSON字符串）
      else {
        formData.append(key, JSON.stringify(value));
      }
    };

    // 处理所有表单数据
    Object.entries(options.formData)
      .filter(([, value]) => value !== undefined && value !== null) // 过滤无效值
      .forEach(([key, value]) => {
        // 处理数组值
        if (Array.isArray(value)) {
          value.forEach(v => process(key, v));
        }
        // 处理单个值
        else {
          process(key, value);
        }
      });

    return formData;
  }
  return undefined;
};

/** 解析器函数类型 */
type Resolver<T> = (options: ApiRequestOptions<T>) => Promise<T>;

/**
 * 解析配置值
 * @param options 请求选项
 * @param resolver 解析器或静态值
 * @returns 解析后的值
 */
export const resolve = async <T>(options: ApiRequestOptions<T>, resolver?: T | Resolver<T>): Promise<T | undefined> => {
  // 如果是函数则调用，否则返回静态值
  if (typeof resolver === 'function') {
    return (resolver as Resolver<T>)(options);
  }
  return resolver;
};

/**
 * 获取请求头
 * @param config OpenAPI配置
 * @param options 请求选项
 * @returns 请求头对象
 */
export const getHeaders = async <T>(config: OpenAPIConfig, options: ApiRequestOptions<T>): Promise<Record<string, string>> => {
  // 并行解析所有可能的动态值
  const [token, username, password, additionalHeaders] = await Promise.all([
    // @ts-ignore
    resolve(options, config.TOKEN), // 解析令牌
    // @ts-ignore
    resolve(options, config.USERNAME), // 解析用户名
    // @ts-ignore
    resolve(options, config.PASSWORD), // 解析密码
    // @ts-ignore
    resolve(options, config.HEADERS), // 解析额外头
  ]);

  // 合并和过滤头信息
  const headers = Object.entries({
    Accept: 'application/json', // 默认接受JSON
    ...additionalHeaders, // 额外头
    ...options.headers, // 选项头
  })
    .filter(([, value]) => value !== undefined && value !== null) // 过滤无效值
    .reduce((headers, [key, value]) => ({
      ...headers,
      [key]: String(value), // 确保值为字符串
    }), {} as Record<string, string>);

  // 添加Bearer令牌认证
  if (isStringWithValue(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 添加Basic认证
  if (isStringWithValue(username) && isStringWithValue(password)) {
    const credentials = base64(`${username}:${password}`);
    headers['Authorization'] = `Basic ${credentials}`;
  }

  // 根据请求体类型设置Content-Type
  if (options.body !== undefined) {
    if (options.mediaType) {
      headers['Content-Type'] = options.mediaType;
    } else if (isBlob(options.body)) {
      headers['Content-Type'] = options.body.type || 'application/octet-stream';
    } else if (isString(options.body)) {
      headers['Content-Type'] = 'text/plain';
    } else if (!isFormData(options.body)) {
      headers['Content-Type'] = 'application/json';
    }
  } else if (options.formData !== undefined) {
    if (options.mediaType) {
      headers['Content-Type'] = options.mediaType;
    }
  }

  return headers;
};

/**
 * 获取请求体
 * @param options 请求选项
 * @returns 请求体或undefined
 */
export const getRequestBody = (options: ApiRequestOptions): unknown => {
  if (options.body) {
    return options.body;
  }
  return undefined;
};

/**
 * 发送请求
 * @param config OpenAPI配置
 * @param options 请求选项
 * @param url 请求URL
 * @param body 请求体
 * @param formData FormData对象
 * @param headers 请求头
 * @param onCancel 取消回调
 * @param axiosClient Axios实例
 * @returns Axios响应
 */
export const sendRequest = async <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions<T>,
  url: string,
  body: unknown,
  formData: FormData | undefined,
  headers: Record<string, string>,
  onCancel: OnCancel,
  axiosClient: AxiosInstance
): Promise<AxiosResponse<T>> => {
  // 创建AbortController用于取消请求
  const controller = new AbortController();

  // 构建请求配置
  let requestConfig: AxiosRequestConfig = {
    data: body ?? formData, // 请求体数据
    headers, // 请求头
    method: options.method, // HTTP方法
    signal: controller.signal, // 取消信号
    url, // 请求URL
    withCredentials: config.WITH_CREDENTIALS, // 是否携带凭证
  };

  // 注册取消回调
  onCancel(() => controller.abort());

  // 应用请求拦截器
  for (const fn of config.interceptors.request._fns) {
    requestConfig = await fn(requestConfig);
  }

  try {
    // 发送请求
    return await axiosClient.request(requestConfig);
  } catch (error) {
    const axiosError = error as AxiosError<T>;
    // 返回响应错误（如果有）
    if (axiosError.response) {
      return axiosError.response;
    }
    // 抛出其他错误
    throw error;
  }
};

/**
 * 获取响应头
 * @param response Axios响应
 * @param responseHeader 指定的响应头字段
 * @returns 响应头值或undefined
 */
export const getResponseHeader = (response: AxiosResponse<unknown>, responseHeader?: string): string | undefined => {
  if (responseHeader) {
    const content = response.headers[responseHeader];
    if (isString(content)) {
      return content;
    }
  }
  return undefined;
};

/**
 * 获取响应体
 * @param response Axios响应
 * @returns 响应体或undefined（对于204状态）
 */
export const getResponseBody = (response: AxiosResponse<unknown>): unknown => {
  if (response.status !== 204) {
    return response.data;
  }
  return undefined;
};

/**
 * 处理错误状态码
 * @param options 请求选项
 * @param result API结果
 * @throws ApiError
 */
export const catchErrorCodes = (options: ApiRequestOptions, result: ApiResult): void => {
  // 定义状态码错误映射
  const errors: Record<number, string> = {
    400: '错误请求',
    401: '未授权',
    402: '需要付款',
    403: '禁止访问',
    404: '未找到',
    405: '方法不允许',
    406: '不可接受',
    407: '需要代理认证',
    408: '请求超时',
    409: '冲突',
    410: '已失效',
    411: '需要长度',
    412: '前提条件失败',
    413: '负载过大',
    414: 'URI过长',
    415: '不支持的媒体类型',
    416: '范围不可满足',
    417: '期望失败',
    418: '我是一个茶壶',
    421: '错误定向请求',
    422: '无法处理的内容',
    423: '已锁定',
    424: '依赖失败',
    425: '过早请求',
    426: '需要升级',
    428: '需要前提条件',
    429: '请求过多',
    431: '请求头字段过大',
    451: '因法律原因不可用',
    500: '内部服务器错误',
    501: '未实现',
    502: '错误网关',
    503: '服务不可用',
    504: '网关超时',
    505: 'HTTP版本不支持',
    506: '变体协商',
    507: '存储空间不足',
    508: '检测到循环',
    510: '未扩展',
    511: '需要网络认证',
    ...options.errors, // 合并自定义错误映射
  }

  // 检查是否有匹配的错误状态码
  const error = errors[result.status];
  if (error) {
    throw new ApiError(options, result, error);
  }

  // 处理非成功响应
  if (!result.ok) {
    const errorStatus = result.status ?? '未知';
    const errorStatusText = result.statusText ?? '未知';
    const errorBody = (() => {
      try {
        return JSON.stringify(result.body, null, 2);
      } catch (e) {
        return undefined;
      }
    })();

    throw new ApiError(options, result,
      `通用错误: 状态码: ${errorStatus}; 状态文本: ${errorStatusText}; 响应体: ${errorBody}`
    );
  }
};

/**
 * 发起API请求
 * @param config OpenAPI配置
 * @param options 请求选项
 * @param axiosClient Axios实例（默认为全局axios）
 * @returns 可取消的Promise
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions<T>, axiosClient: AxiosInstance = axios): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    try {
      // 准备请求
      const url = getUrl(config, options); // 获取完整URL
      const formData = getFormData(options); // 获取FormData
      const body = getRequestBody(options); // 获取请求体
      const headers = await getHeaders(config, options); // 获取请求头

      // 检查是否已取消
      if (!onCancel.isCancelled) {
        // 发送请求
        let response = await sendRequest<T>(config, options, url, body, formData, headers, onCancel, axiosClient);

        // 应用响应拦截器
        for (const fn of config.interceptors.response._fns) {
          response = await fn(response);
        }

        // 处理响应
        const responseBody = getResponseBody(response); // 获取响应体
        const responseHeader = getResponseHeader(response, options.responseHeader); // 获取指定响应头

        // 应用响应转换器（仅对成功响应）
        let transformedBody = responseBody;
        if (options.responseTransformer && isSuccess(response.status)) {
          transformedBody = await options.responseTransformer(responseBody)
        }

        // 构建API结果
        const result: ApiResult = {
          url,
          ok: isSuccess(response.status), // 是否成功
          status: response.status, // 状态码
          statusText: response.statusText, // 状态文本
          body: responseHeader ?? transformedBody, // 优先返回指定响应头
        };

        // 检查错误状态码
        catchErrorCodes(options, result);

        // 解析结果
        resolve(result.body);
      }
    } catch (error) {
      // 拒绝Promise
      reject(error);
    }
  });
};