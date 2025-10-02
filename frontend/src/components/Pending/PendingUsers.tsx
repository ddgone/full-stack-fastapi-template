import { Table } from "@chakra-ui/react"
import { SkeletonText } from "../ui/skeleton"

/**
 * 加载状态用户表格组件
 *
 * 在用户数据加载过程中显示骨架屏效果，提升用户体验
 */
const PendingUsers = () => (
  <Table.Root
    size={{ base: "sm", md: "md" }} // 响应式尺寸
  >
    {/* 表头 */}
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader w="sm">全名</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">邮箱</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">角色</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">状态</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">操作</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>

    {/* 表体（骨架屏） */}
    <Table.Body>
      {/* 生成5行骨架屏 */}
      {[...Array(5)].map((_, index) => (
        <Table.Row key={index}>
          {/* 全名列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} /> {/* 单行骨架文本 */}
          </Table.Cell>

          {/* 邮箱列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} />
          </Table.Cell>

          {/* 角色列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} />
          </Table.Cell>

          {/* 状态列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} />
          </Table.Cell>

          {/* 操作列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
)

export default PendingUsers