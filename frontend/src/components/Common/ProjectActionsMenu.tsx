import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import type { ProjectPublic } from "@/client"
import DeleteProject from "@/components/Projects/DeleteProject.tsx"
import EditProject from "@/components/Projects/EditProject.tsx"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

/**
 * 项目操作菜单组件属性
 *
 * @property project 要操作的项目对象
 */
interface ProjectActionsMenuProps {
  project: ProjectPublic
}

/**
 * 项目操作菜单组件
 *
 * 提供一个下拉菜单用于执行项目相关操作（编辑、删除）
 *
 * @param project 要操作的项目对象
 */
export const ProjectActionsMenu = ({ project }: ProjectActionsMenuProps) => {
  return (
    // 菜单根组件
    <MenuRoot>
      {/* 菜单触发按钮 */}
      <MenuTrigger asChild>
        <IconButton
          variant="ghost" // 透明背景样式
          color="inherit" // 继承父元素颜色
          aria-label="项目操作菜单" // 无障碍标签
        >
          {/* 垂直三点图标 */}
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>

      {/* 菜单内容 */}
      <MenuContent>
        {/* 编辑项目组件 */}
        <EditProject project={project} />

        {/* 删除项目组件 */}
        <DeleteProject id={project.id} />
      </MenuContent>
    </MenuRoot>
  )
}