import { Badge, Container, Flex, Heading, Table } from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { type UserPublic, UsersService } from "@/client"
import AddUser from "@/components/Admin/AddUser"
import { UserActionsMenu } from "@/components/Common/UserActionsMenu"
import PendingUsers from "@/components/Pending/PendingUsers"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

// 用户搜索参数验证模式
const usersSearchSchema = z.object({
  page: z.number().catch(1), // 页码，默认为1
})

const PER_PAGE = 5 // 每页显示的用户数

/**
 * 获取用户查询选项
 *
 * @param page 当前页码
 * @returns 查询选项对象
 */
function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({
        skip: (page - 1) * PER_PAGE, // 计算跳过数量
        limit: PER_PAGE // 每页数量
      }),
    queryKey: ["users", { page }], // 查询键
  }
}

// 创建管理页面路由
export const Route = createFileRoute("/_layout/admin")({
  component: Admin, // 页面组件
  validateSearch: (search) => usersSearchSchema.parse(search), // 验证搜索参数
})

/**
 * 用户表格组件
 *
 * 显示用户列表和分页控件
 */
function UsersTable() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]) // 当前登录用户
  const navigate = useNavigate({ from: Route.fullPath }) // 导航函数
  const { page } = Route.useSearch() // 从路由获取当前页码

  // 查询用户数据
  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page }), // 查询选项
    placeholderData: (prevData) => prevData, // 使用旧数据作为占位
  })

  /**
   * 设置页码
   *
   * @param page 新页码
   */
  const setPage = (page: number) => {
    navigate({
      to: "/admin", // 导航到管理页面
      search: (prev) => ({ ...prev, page }), // 更新页码参数
    })
  }

  // 获取当前页用户数据
  const users = data?.data.slice(0, PER_PAGE) ?? []
  // 获取用户总数
  const count = data?.count ?? 0

  // 加载中显示骨架屏
  if (isLoading) {
    return <PendingUsers />
  }

  return (
    <>
      {/* 用户表格 */}
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="sm">姓名</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">邮箱</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">角色</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">状态</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">操作</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users?.map((user) => (
            <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell color={!user.full_name ? "gray" : "inherit"}>
                {user.full_name || "未填写"}
                {/* 标记当前用户 */}
                {currentUser?.id === user.id && (
                  <Badge ml="1" colorScheme="teal">
                    您
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {user.email}
              </Table.Cell>
              <Table.Cell>
                {user.is_superuser ? "管理员" : "普通用户"}
              </Table.Cell>
              <Table.Cell>{user.is_active ? "激活" : "未激活"}</Table.Cell>
              <Table.Cell>
                {/* 用户操作菜单 */}
                <UserActionsMenu
                  user={user}
                  disabled={currentUser?.id === user.id} // 禁用当前用户的操作
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* 分页控件 */}
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count} // 总用户数
          pageSize={PER_PAGE} // 每页数量
          onPageChange={({ page }) => setPage(page)} // 页码变更回调
        >
          <Flex>
            <PaginationPrevTrigger /> {/* 上一页按钮 */}
            <PaginationItems /> {/* 页码项 */}
            <PaginationNextTrigger /> {/* 下一页按钮 */}
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

/**
 * 管理页面组件
 *
 * 显示用户管理界面
 */
function Admin() {
  return (
    <Container maxW="full">
      {/* 页面标题 */}
      <Heading size="lg" pt={12}>
        用户管理
      </Heading>

      {/* 添加用户组件 */}
      <AddUser />

      {/* 用户表格组件 */}
      <UsersTable />
    </Container>
  )
}
