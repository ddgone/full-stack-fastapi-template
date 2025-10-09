import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"

import { ItemsService } from "@/client"
import { ItemActionsMenu } from "@/components/Common/ItemActionsMenu"
import AddItem from "@/components/Items/AddItem"
import PendingItems from "@/components/Pending/PendingItems"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

/**
 * 物品搜索参数验证模式
 *
 * 定义URL搜索参数的结构和默认值
 */
const itemsSearchSchema = z.object({
  page: z.number().catch(1), // 页码，默认为1
})

/**
 * 每页显示物品数量
 */
const PER_PAGE = 5

/**
 * 获取物品查询选项
 *
 * @param page 当前页码
 * @returns 查询选项对象
 */
function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ItemsService.readItems({
        skip: (page - 1) * PER_PAGE, // 计算跳过数量
        limit: PER_PAGE // 每页数量
      }),
    queryKey: ["items", { page }], // 查询键
  }
}

/**
 * 创建物品路由
 */
export const Route = createFileRoute("/_layout/items")({
  component: Items, // 路由组件
  validateSearch: (search) => itemsSearchSchema.parse(search), // 验证搜索参数
})

/**
 * 物品表格组件
 *
 * 显示物品列表和分页控件
 */
function ItemsTable() {
  // 导航函数
  const navigate = useNavigate({ from: Route.fullPath })
  // 从URL获取当前页码
  const { page } = Route.useSearch()

  // 物品查询
  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getItemsQueryOptions({ page }), // 查询选项
    placeholderData: (prevData) => prevData, // 使用之前的数据作为占位
  })

  /**
   * 设置页码
   * @param page 新页码
   */
  const setPage = (page: number) => {
    navigate({
      to: "/items",
      search: (prev) => ({ ...prev, page }), // 更新URL中的页码
    })
  }

  // 当前页物品列表
  const items = data?.data.slice(0, PER_PAGE) ?? []
  // 物品总数
  const count = data?.count ?? 0

  // 加载状态显示骨架屏
  if (isLoading) {
    return <PendingItems />
  }

  // 无物品时显示空状态
  if (items.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>暂无物品</EmptyState.Title>
            <EmptyState.Description>
              添加新物品以开始管理
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <>
      {/* 物品表格 */}
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="sm">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">标题</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">描述</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">操作</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items?.map((item) => (
            <Table.Row
              key={item.id}
              opacity={isPlaceholderData ? 0.5 : 1} // 占位数据时降低透明度
            >
              <Table.Cell truncate maxW="sm">
                {item.id}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {item.title}
              </Table.Cell>
              <Table.Cell
                color={!item.description ? "gray" : "inherit"} // 无描述时显示灰色
                truncate
                maxW="30%"
              >
                {item.description || "无描述"} {/* 无描述时显示"无描述" */}
              </Table.Cell>
              <Table.Cell>
                {/* 物品操作菜单 */}
                <ItemActionsMenu item={item} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* 分页控件 */}
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count} // 物品总数
          pageSize={PER_PAGE} // 每页数量
          onPageChange={({ page }) => setPage(page)} // 页码变化回调
        >
          <Flex>
            <PaginationPrevTrigger /> {/* 上一页按钮 */}
            <PaginationItems /> {/* 页码列表 */}
            <PaginationNextTrigger /> {/* 下一页按钮 */}
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

/**
 * 物品管理页面组件
 */
function Items() {
  return (
    <Container maxW="full">
      {/* 页面标题 */}
      <Heading size="lg" pt={12}>
        物品管理
      </Heading>

      {/* 添加物品按钮 */}
      <AddItem />

      {/* 物品表格 */}
      <ItemsTable />
    </Container>
  )
}
