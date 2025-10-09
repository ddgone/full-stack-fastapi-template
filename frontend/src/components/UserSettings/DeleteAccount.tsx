import { Container, Heading, Text } from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation" // 删除确认组件

/**
 * 删除账户页面组件
 *
 * 提供删除用户账户的功能
 */
const DeleteAccount = () => {
  return (
    <Container maxW="full"> {/* 全宽容器 */}
      {/* 页面标题 */}
      <Heading size="sm" py={4}>
        删除账户
      </Heading>

      {/* 删除账户说明 */}
      <Text>
        永久删除您的数据以及与账户相关的所有内容。
      </Text>

      {/* 删除确认组件 */}
      <DeleteConfirmation />
    </Container>
  )
}

export default DeleteAccount