/**
 * API响应结果类型定义
 *
 * 该类型封装了API调用的完整响应信息
 *
 * @template TData 指定响应体数据类型，默认为any
 */
export type ApiResult<TData = any> = {
  /**
   * 响应体数据
   *
   * 根据请求配置的responseTransformer转换后的数据
   */
  readonly body: TData;

  /**
   * 请求是否成功
   *
   * 当HTTP状态码在200-299范围内时为true
   */
  readonly ok: boolean;

  /** HTTP状态码 */
  readonly status: number;

  /** HTTP状态文本 */
  readonly statusText: string;

  /**
   * 实际请求的URL地址
   *
   * 包含最终解析的路径参数和查询参数
   */
  readonly url: string;
};