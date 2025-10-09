"use client" // 客户端组件指令

import type { ButtonProps, TextProps } from "@chakra-ui/react"
import {
  Button,
  Pagination as ChakraPagination,
  IconButton,
  Text,
  createContext,
  usePaginationContext,
} from "@chakra-ui/react"
import * as React from "react"
import {
  HiChevronLeft,
  HiChevronRight,
  HiMiniEllipsisHorizontal,
} from "react-icons/hi2" // 分页图标
import { LinkButton } from "./link-button" // 自定义链接按钮

/**
 * 按钮变体映射
 *
 * 定义不同状态下按钮的变体
 */
interface ButtonVariantMap {
  current: ButtonProps["variant"] // 当前页按钮变体
  default: ButtonProps["variant"] // 默认按钮变体
  ellipsis: ButtonProps["variant"] // 省略号按钮变体
}

/**
 * 分页组件变体类型
 */
type PaginationVariant = "outline" | "solid" | "subtle"

/**
 * 按钮变体上下文
 *
 * 存储分页组件的共享配置
 */
interface ButtonVariantContext {
  size: ButtonProps["size"] // 按钮尺寸
  variantMap: ButtonVariantMap // 按钮变体映射
  getHref?: (page: number) => string // 生成链接的函数
}

// 创建上下文提供共享配置
const [RootPropsProvider, useRootProps] = createContext<ButtonVariantContext>({
  name: "RootPropsProvider", // 上下文名称
})

/**
 * 分页根组件属性
 *
 * 扩展自Chakra分页根组件属性
 */
export interface PaginationRootProps
  extends Omit<ChakraPagination.RootProps, "type"> {
  size?: ButtonProps["size"] // 按钮尺寸
  variant?: PaginationVariant // 分页变体
  getHref?: (page: number) => string // 生成链接的函数
}

/**
 * 分页变体映射
 *
 * 定义不同分页变体对应的按钮样式
 */
const variantMap: Record<PaginationVariant, ButtonVariantMap> = {
  outline: { default: "ghost", ellipsis: "plain", current: "outline" },
  solid: { default: "outline", ellipsis: "outline", current: "solid" },
  subtle: { default: "ghost", ellipsis: "plain", current: "subtle" },
}

/**
 * 分页根组件
 *
 * 提供分页组件的上下文配置
 */
export const PaginationRoot = React.forwardRef<
  HTMLDivElement,
  PaginationRootProps
>(function PaginationRoot(props, ref) {
  // 解构属性
  const { size = "sm", variant = "outline", getHref, ...rest } = props

  return (
    /* 提供共享配置上下文 */
    <RootPropsProvider
      value={{
        size,
        variantMap: variantMap[variant],
        getHref
      }}
    >
      {/* 分页根容器 */}
      <ChakraPagination.Root
        ref={ref}
        type={getHref ? "link" : "button"} // 根据是否有getHref确定类型
        {...rest}
      />
    </RootPropsProvider>
  )
})

/**
 * 分页省略号组件
 *
 * 显示分页中的省略号
 */
export const PaginationEllipsis = React.forwardRef<
  HTMLDivElement,
  ChakraPagination.EllipsisProps
>(function PaginationEllipsis(props, ref) {
  // 从上下文获取配置
  const { size, variantMap } = useRootProps()

  return (
    <ChakraPagination.Ellipsis ref={ref} {...props} asChild>
      {/* 省略号按钮 */}
      <Button as="span" variant={variantMap.ellipsis} size={size}>
        <HiMiniEllipsisHorizontal /> {/* 省略号图标 */}
      </Button>
    </ChakraPagination.Ellipsis>
  )
})

/**
 * 分页项组件
 *
 * 显示单个页码按钮
 */
export const PaginationItem = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.ItemProps
>(function PaginationItem(props, ref) {
  // 从分页上下文获取当前页码
  const { page } = usePaginationContext()
  // 从共享上下文获取配置
  const { size, variantMap, getHref } = useRootProps()

  // 判断是否为当前页
  const current = page === props.value
  // 根据是否当前页选择按钮变体
  const variant = current ? variantMap.current : variantMap.default

  // 如果是链接模式
  if (getHref) {
    return (
      <LinkButton
        href={getHref(props.value)} // 生成链接
        variant={variant}
        size={size}
      >
        {props.value} {/* 页码 */}
      </LinkButton>
    )
  }

  // 按钮模式
  return (
    <ChakraPagination.Item ref={ref} {...props} asChild>
      <Button variant={variant} size={size}>
        {props.value} {/* 页码 */}
      </Button>
    </ChakraPagination.Item>
  )
})

/**
 * 上一页触发器组件
 *
 * 显示上一页按钮
 */
export const PaginationPrevTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.PrevTriggerProps
>(function PaginationPrevTrigger(props, ref) {
  // 从上下文获取配置
  const { size, variantMap, getHref } = useRootProps()
  // 从分页上下文获取上一页页码
  const { previousPage } = usePaginationContext()

  // 链接模式
  if (getHref) {
    return (
      <LinkButton
        href={previousPage != null ? getHref(previousPage) : undefined}
        variant={variantMap.default}
        size={size}
      >
        <HiChevronLeft /> {/* 上一页图标 */}
      </LinkButton>
    )
  }

  // 按钮模式
  return (
    <ChakraPagination.PrevTrigger ref={ref} asChild {...props}>
      <IconButton variant={variantMap.default} size={size}>
        <HiChevronLeft /> {/* 上一页图标 */}
      </IconButton>
    </ChakraPagination.PrevTrigger>
  )
})

/**
 * 下一页触发器组件
 *
 * 显示下一页按钮
 */
export const PaginationNextTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPagination.NextTriggerProps
>(function PaginationNextTrigger(props, ref) {
  // 从上下文获取配置
  const { size, variantMap, getHref } = useRootProps()
  // 从分页上下文获取下一页页码
  const { nextPage } = usePaginationContext()

  // 链接模式
  if (getHref) {
    return (
      <LinkButton
        href={nextPage != null ? getHref(nextPage) : undefined}
        variant={variantMap.default}
        size={size}
      >
        <HiChevronRight /> {/* 下一页图标 */}
      </LinkButton>
    )
  }

  // 按钮模式
  return (
    <ChakraPagination.NextTrigger ref={ref} asChild {...props}>
      <IconButton variant={variantMap.default} size={size}>
        <HiChevronRight /> {/* 下一页图标 */}
      </IconButton>
    </ChakraPagination.NextTrigger>
  )
})

/**
 * 分页项列表组件
 *
 * 渲染所有分页项（页码和省略号）
 */
export const PaginationItems = (props: React.HTMLAttributes<HTMLElement>) => {
  return (
    <ChakraPagination.Context>
      {({ pages }) => // 从分页上下文获取页码数组
        pages.map((page, index) => {
          // 如果是省略号
          if (page.type === "ellipsis") {
            return (
              <PaginationEllipsis
                key={index}
                index={index}
                {...props}
              />
            )
          }

          // 如果是页码
          return (
            <PaginationItem
              key={index}
              type="page"
              value={page.value} // 页码值
              {...props}
            />
          )
        })
      }
    </ChakraPagination.Context>
  )
}

/**
 * 页码文本组件属性
 *
 * @property format 文本显示格式
 */
interface PageTextProps extends TextProps {
  format?: "short" | "compact" | "long" // 文本格式选项
}

/**
 * 页码文本组件
 *
 * 显示当前页码和总页数信息
 */
export const PaginationPageText = React.forwardRef<
  HTMLParagraphElement,
  PageTextProps
>(function PaginationPageText(props, ref) {
  const { format = "compact", ...rest } = props
  // 从分页上下文获取分页信息
  const { page, totalPages, pageRange, count } = usePaginationContext()

  // 根据格式生成文本内容
  const content = React.useMemo(() => {
    if (format === "short") return `${page} / ${totalPages}`
    if (format === "compact") return `${page} of ${totalPages}`
    return `${pageRange.start + 1} - ${Math.min(
      pageRange.end,
      count,
    )} of ${count}`
  }, [format, page, totalPages, pageRange, count])

  return (
    <Text
      fontWeight="medium" // 中等字体粗细
      ref={ref}
      {...rest}
    >
      {content}
    </Text>
  )
})
