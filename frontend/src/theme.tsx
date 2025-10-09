import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe" // 导入按钮配方

/**
 * 创建自定义系统配置
 *
 * 基于Chakra UI默认配置扩展自定义主题和全局样式
 */
export const system = createSystem(
  // 使用默认配置作为基础
  defaultConfig,
  {
    /**
     * 全局CSS样式
     *
     * 定义应用于整个文档的全局样式
     */
    globalCss: {
      // HTML元素样式
      html: {
        fontSize: "16px", // 基础字体大小
      },
      // Body元素样式
      body: {
        fontSize: "0.875rem", // 默认字体大小（14px）
        margin: 0, // 移除默认外边距
        padding: 0, // 移除默认内边距
      },
      // 自定义链接类样式
      ".main-link": {
        color: "ui.main", // 使用自定义颜色令牌
        fontWeight: "bold", // 粗体
      },
    },

    /**
     * 主题扩展配置
     *
     * 定义自定义设计令牌和组件配方
     */
    theme: {
      /**
       * 设计令牌
       *
       * 定义可重用的设计值
       */
      tokens: {
        // 颜色令牌
        colors: {
          ui: {
            // 主UI颜色
            main: { value: "#009688" }, // 蓝绿色
          },
        },
      },

      /**
       * 组件配方
       *
       * 定义可重用组件样式
       */
      recipes: {
        // 按钮组件配方
        button: buttonRecipe,
      },
    },
  }
)
