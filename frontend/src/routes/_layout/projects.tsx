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

import { ProjectsService } from "@/client"
import { ProjectActionsMenu } from "@/components/Common/ProjectActionsMenu.tsx"
import AddProject from "@/components/Projects/AddProject.tsx"
import PendingProjects from "@/components/Pending/PendingProjects.tsx"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

/**
 * 项目搜索参数验证模式
 *
 * 定义URL搜索参数的结构和默认值
 */
const projectsSearchSchema = z.object({
  page: z.number().catch(1), // 页码，默认为1
})

/**
 * 每页显示项目数量
 */
const PER_PAGE = 5

/**
 * 获取项目查询选项
 *
 * @param page 当前页码
 * @returns 查询选项对象
 */
function getProjectsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ProjectsService.readProjects({
        skip: (page - 1) * PER_PAGE, // 计算跳过数量
        limit: PER_PAGE // 每页数量
      }),
    queryKey: ["projects", { page }], // 查询键
  }
}

/**
 * 创建项目路由
 */
export const Route = createFileRoute("/_layout/projects")({
  component: Projects, // 路由组件
  validateSearch: (search) => projectsSearchSchema.parse(search), // 验证搜索参数
})

/**
 * 项目表格组件
 *
 * 显示项目列表和分页控件
 */
function ProjectsTable() {
  // 导航函数
  const navigate = useNavigate({ from: Route.fullPath })
  // 从URL获取当前页码
  const { page } = Route.useSearch()

  // 项目查询
  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getProjectsQueryOptions({ page }), // 查询选项
    placeholderData: (prevData) => prevData, // 使用之前的数据作为占位
  })

  /**
   * 设置页码
   * @param page 新页码
   */
  const setPage = (page: number) => {
    navigate({
      to: "/projects",
      search: (prev) => ({ ...prev, page }), // 更新URL中的页码
    })
  }

  // 当前页项目列表
  const projects = data?.data.slice(0, PER_PAGE) ?? []
  // 项目总数
  const count = data?.count ?? 0

  // 加载状态显示骨架屏
  if (isLoading) {
    return <PendingProjects />
  }

  // 无项目时显示空状态
  if (projects.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>暂无项目</EmptyState.Title>
            <EmptyState.Description>
              添加新项目以开始管理
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <>
      {/* 项目表格 */}
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
          {projects?.map((project) => (
            <Table.Row
              key={project.id}
              opacity={isPlaceholderData ? 0.5 : 1} // 占位数据时降低透明度
            >
              <Table.Cell truncate maxW="sm">
                {project.id}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {project.title}
              </Table.Cell>
              <Table.Cell
                color={!project.description ? "gray" : "inherit"} // 无描述时显示灰色
                truncate
                maxW="30%"
              >
                {project.description || "无描述"} {/* 无描述时显示"无描述" */}
              </Table.Cell>
              <Table.Cell>
                {/* 项目操作菜单 */}
                <ProjectActionsMenu project={project} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* 分页控件 */}
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count} // 项目总数
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
 * 项目管理页面组件
 */
function Projects() {
  return (
    <Container maxW="full">
      {/* 页面标题 */}
      <Heading size="lg" pt={12}>
        项目管理
      </Heading>

      {/* 添加项目按钮 */}
      <AddProject />

      {/* 项目表格 */}
      <ProjectsTable />
    </Container>
  )
}
