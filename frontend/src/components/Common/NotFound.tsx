import { Button, Center, Flex, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

/**
 * 404页面组件
 *
 * 当用户访问不存在的路由时显示此页面
 */
const NotFound = () => {
  return (
    <Flex
      height="100vh" // 全屏高度
      align="center" // 垂直居中
      justify="center" // 水平居中
      flexDir="column" // 垂直排列
      data-testid="not-found" // 测试标识
      p={4} // 内边距
    >
      {/* 404错误代码显示区域 */}
      <Flex alignItems="center" zIndex={1}>
        <Flex flexDir="column" ml={4} align="center" justify="center" p={4}>
          {/* 大号404数字 */}
          <Text
            fontSize={{ base: "6xl", md: "8xl" }} // 响应式字体大小
            fontWeight="bold" // 粗体
            lineHeight="1" // 行高为1
            mb={4} // 底部外边距
          >
            404
          </Text>

          {/* "Oops!"标题 */}
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            哎呀！
          </Text>
        </Flex>
      </Flex>

      {/* 错误信息描述 */}
      <Text
        fontSize="lg" // 大号字体
        color="gray.600" // 灰色文字
        mb={4} // 底部外边距
        textAlign="center" // 文本居中
        zIndex={1} // 层级
      >
        您访问的页面不存在。
      </Text>

      {/* 返回首页按钮 */}
      <Center zIndex={1}>
        <Link to="/">
          <Button
            variant="solid" // 实心按钮
            colorScheme="teal" // 青色主题
            mt={4} // 顶部外边距
            alignSelf="center" // 自身居中
          >
            返回首页
          </Button>
        </Link>
      </Center>
    </Flex>
  )
}

export default NotFound