import { defineRecipe } from "@chakra-ui/react"

/**
 * 按钮样式配方
 *
 * 定义按钮的基础样式和变体样式
 */
export const buttonRecipe = defineRecipe({
  /**
   * 基础样式
   *
   * 应用于所有按钮变体的公共样式
   */
  base: {
    fontWeight: "bold", // 字体加粗
    display: "flex", // 使用flex布局
    alignItems: "center", // 垂直居中
    justifyContent: "center", // 水平居中
    colorPalette: "teal", // 默认颜色方案为青色
  },

  /**
   * 变体定义
   *
   * 定义按钮的不同视觉变体
   */
  variants: {
    /**
     * 变体类型
     *
     * 这里定义了"ghost"变体
     */
    variant: {
      /**
       * 幽灵变体
       *
       * 透明背景，悬停时显示浅灰色背景
       */
      ghost: {
        bg: "transparent", // 背景透明
        _hover: { // 悬停状态
          bg: "gray.100", // 浅灰色背景
        },
      },
    },
  },
})
