import { Table } from "@chakra-ui/react"
import { SkeletonText } from "../ui/skeleton"

/**
 * 加载状态项目表格组件
 *
 * 在数据加载过程中显示骨架屏效果，提升用户体验
 */
const PendingItems = () => (
  <Table.Root
    size={{ base: "sm", md: "md" }} // 响应式尺寸
  >
    {/* 表头 */}
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader w="sm">ID</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">标题</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">描述</Table.ColumnHeader>
        <Table.ColumnHeader w="sm">操作</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>

    {/* 表体（骨架屏） */}
    <Table.Body>
      {/* 生成5行骨架屏 */}
      {[...Array(5)].map((_, index) => (
        <Table.Row key={index}>
          {/* ID列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} /> {/* 单行骨架文本 */}
          </Table.Cell>

          {/* 标题列骨架 */}
          <Table.Cell>
            <SkeletonText noOfLines={1} />
          </Table.Cell>

          {/* 描述列骨架 */}
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

export default PendingItems