import type {
  SkeletonProps as ChakraSkeletonProps,
  CircleProps,
} from "@chakra-ui/react"
import { Skeleton as ChakraSkeleton, Circle, Stack } from "@chakra-ui/react"
import * as React from "react"

/**
 * 圆形骨架屏组件属性
 *
 * @property size 圆形尺寸
 */
export interface SkeletonCircleProps extends ChakraSkeletonProps {
  size?: CircleProps["size"]
}

/**
 * 圆形骨架屏组件
 *
 * 显示圆形的加载占位图
 */
export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(function SkeletonCircle(props, ref) {
  const { size, ...rest } = props
  return (
    /* 圆形容器 */
    <Circle size={size} asChild ref={ref}>
      {/* 骨架屏元素 */}
      <ChakraSkeleton {...rest} />
    </Circle>
  )
})

/**
 * 文本骨架屏组件属性
 *
 * @property noOfLines 文本行数（默认为3）
 */
export interface SkeletonTextProps extends ChakraSkeletonProps {
  noOfLines?: number
}

/**
 * 文本骨架屏组件
 *
 * 显示多行文本的加载占位图
 */
export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    // 解构属性
    const { noOfLines = 3, gap, ...rest } = props

    return (
      /* 垂直堆叠容器 */
      <Stack gap={gap} width="full" ref={ref}>
        {/* 生成指定行数的骨架屏 */}
        {Array.from({ length: noOfLines }).map((_, index) => (
          <ChakraSkeleton
            height="4" // 行高
            key={index} // 唯一键
            {...props} // 传递属性
            _last={{ maxW: "80%" }} // 最后一行宽度为80%
            {...rest} // 传递其他属性
          />
        ))}
      </Stack>
    )
  },
)

/**
 * 基础骨架屏组件
 *
 * 直接导出Chakra UI的骨架屏组件
 */
export const Skeleton = ChakraSkeleton