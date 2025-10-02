import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';

/**
 * 自定义API错误类，用于封装API请求的错误信息
 *
 * 继承自JavaScript原生Error类，添加了API特有的错误信息字段
 */
export class ApiError extends Error {
  /** 请求的URL地址 */
  public readonly url: string;

  /** HTTP状态码 */
  public readonly status: number;

  /** HTTP状态文本 */
  public readonly statusText: string;

  /** 响应体内容 */
  public readonly body: unknown;

  /** 原始请求选项 */
  public readonly request: ApiRequestOptions;

  /**
   * 构造函数
   * @param request 原始请求选项
   * @param response API响应结果
   * @param message 错误消息
   */
  constructor(request: ApiRequestOptions, response: ApiResult, message: string) {
    // 调用父类构造函数
    super(message);

    // 设置错误名称
    this.name = 'ApiError';

    // 从响应中提取关键信息
    this.url = response.url;          // 请求的URL
    this.status = response.status;    // HTTP状态码
    this.statusText = response.statusText; // HTTP状态文本
    this.body = response.body;        // 响应体内容

    // 保存原始请求配置
    this.request = request;
  }
}