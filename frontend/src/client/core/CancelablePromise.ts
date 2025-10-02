/**
 * 取消操作错误类
 *
 * 表示一个因取消操作而导致的错误
 */
export class CancelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CancelError'; // 设置错误名称
  }

  /**
   * 是否为取消错误标志
   *
   * 始终返回true，用于识别取消错误
   */
  public get isCancelled(): boolean {
    return true;
  }
}

/**
 * 取消回调接口
 *
 * 用于向可取消Promise注册取消处理函数
 */
export interface OnCancel {
  /** 是否已解决 */
  readonly isResolved: boolean;
  /** 是否已拒绝 */
  readonly isRejected: boolean;
  /** 是否已取消 */
  readonly isCancelled: boolean;

  /**
   * 注册取消处理函数
   * @param cancelHandler 取消时要执行的回调函数
   */
  (cancelHandler: () => void): void;
}

/**
 * 可取消的Promise类
 *
 * 扩展原生Promise，增加取消功能
 *
 * @template T Promise解析值的类型
 */
export class CancelablePromise<T> implements Promise<T> {
  // 内部状态标志
  private _isResolved: boolean;
  private _isRejected: boolean;
  private _isCancelled: boolean;

  /** 注册的取消处理函数列表 */
  readonly cancelHandlers: (() => void)[];

  /** 内部Promise实例 */
  readonly promise: Promise<T>;

  // Promise解决/拒绝函数
  private _resolve?: (value: T | PromiseLike<T>) => void;
  private _reject?: (reason?: unknown) => void;

  /**
   * 构造函数
   * @param executor 执行函数，接收resolve、reject和onCancel三个参数
   */
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: unknown) => void,
      onCancel: OnCancel
    ) => void
  ) {
    // 初始化状态
    this._isResolved = false;
    this._isRejected = false;
    this._isCancelled = false;
    this.cancelHandlers = [];

    // 创建内部Promise
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;

      // 封装解决函数，添加状态检查
      const onResolve = (value: T | PromiseLike<T>): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return;
        }
        this._isResolved = true;
        if (this._resolve) this._resolve(value);
      };

      // 封装拒绝函数，添加状态检查
      const onReject = (reason?: unknown): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return;
        }
        this._isRejected = true;
        if (this._reject) this._reject(reason);
      };

      // 创建onCancel回调函数
      const onCancel = (cancelHandler: () => void): void => {
        // 如果已解决/拒绝/取消，则忽略注册
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return;
        }
        // 注册取消处理函数
        this.cancelHandlers.push(cancelHandler);
      };

      // 为onCancel添加状态访问属性
      Object.defineProperty(onCancel, 'isResolved', {
        get: (): boolean => this._isResolved,
      });

      Object.defineProperty(onCancel, 'isRejected', {
        get: (): boolean => this._isRejected,
      });

      Object.defineProperty(onCancel, 'isCancelled', {
        get: (): boolean => this._isCancelled,
      });

      // 执行用户提供的executor函数
      return executor(onResolve, onReject, onCancel as OnCancel);
    });
  }

  /** Symbol.toStringTag实现 */
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }

  // 以下方法代理到内部Promise实例
  public then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected);
  }

  public catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.promise.catch(onRejected);
  }

  public finally(onFinally?: (() => void) | null): Promise<T> {
    return this.promise.finally(onFinally);
  }

  /**
   * 取消Promise
   *
   * 执行所有注册的取消处理函数，并拒绝Promise
   */
  public cancel(): void {
    // 如果已解决/拒绝/取消，则忽略
    if (this._isResolved || this._isRejected || this._isCancelled) {
      return;
    }

    // 标记为已取消
    this._isCancelled = true;

    // 执行所有取消处理函数
    if (this.cancelHandlers.length) {
      try {
        for (const cancelHandler of this.cancelHandlers) {
          cancelHandler();
        }
      } catch (error) {
        // 捕获并记录取消处理函数中的错误
        console.warn('取消操作抛出错误', error);
        return;
      }
    }

    // 清空处理函数列表
    this.cancelHandlers.length = 0;

    // 拒绝Promise并抛出取消错误
    if (this._reject) this._reject(new CancelError('请求已中止'));
  }

  /** 获取是否已取消 */
  public get isCancelled(): boolean {
    return this._isCancelled;
  }
}