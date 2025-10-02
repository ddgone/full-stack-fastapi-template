import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import type { ItemPublic } from "@/client"
import DeleteItem from "../Items/DeleteItem"
import EditItem from "../Items/EditItem"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

/**
 * 项目操作菜单组件属性
 *
 * @property item 要操作的项目对象
 */
interface ItemActionsMenuProps {
  item: ItemPublic
}

/**
 * 项目操作菜单组件
 *
 * 提供一个下拉菜单用于执行项目相关操作（编辑、删除）
 *
 * @param item 要操作的项目对象
 */
export const ItemActionsMenu = ({ item }: ItemActionsMenuProps) => {
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
        <EditItem item={item} />

        {/* 删除项目组件 */}
        <DeleteItem id={item.id} />
      </MenuContent>
    </MenuRoot>
  )
}