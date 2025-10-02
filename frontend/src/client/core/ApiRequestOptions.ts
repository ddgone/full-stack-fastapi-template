/**
 * API请求选项类型定义
 *
 * 该类型定义了发起API请求时可配置的所有选项
 *
 * @template T 指定响应数据的转换类型，默认为unknown
 */
export type ApiRequestOptions<T = unknown> = {
  /** 请求体数据，支持任意类型 */
  readonly body?: any;

  /** Cookie信息，键值对形式 */
  readonly cookies?: Record<string, unknown>;

  /** 自定义错误映射，键为状态码或错误代码，值为错误消息 */
  readonly errors?: Record<number | string, string>;

  /**
   * 表单数据，支持多种格式：
   * - 键值对对象
   * - 数组
   * - Blob对象
   * - File对象
   */
  readonly formData?: Record<string, unknown> | any[] | Blob | File;

  /** 请求头信息，键值对形式 */
  readonly headers?: Record<string, unknown>;

  /** 媒体类型（如application/json） */
  readonly mediaType?: string;

  /** HTTP请求方法 */
  readonly method:
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'OPTIONS'
    | 'PATCH'
    | 'POST'
    | 'PUT';

  /** 路径参数，用于替换URL中的占位符 */
  readonly path?: Record<string, unknown>;

  /** 查询参数，将转换为URL查询字符串 */
  readonly query?: Record<string, unknown>;

  /** 指定需要提取的响应头字段 */
  readonly responseHeader?: string;

  /** 响应数据转换函数，用于处理原始响应数据 */
  readonly responseTransformer?: (data: unknown) => Promise<T>;

  /** 请求的完整URL地址 */
  readonly url: string;
};