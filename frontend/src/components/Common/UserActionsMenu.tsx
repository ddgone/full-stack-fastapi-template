import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import type { UserPublic } from "@/client"
import DeleteUser from "../Admin/DeleteUser"
import EditUser from "../Admin/EditUser"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

/**
 * 用户操作菜单组件属性
 *
 * @property user 要操作的用户对象
 * @property disabled 是否禁用菜单按钮
 */
interface UserActionsMenuProps {
  user: UserPublic
  disabled?: boolean
}

/**
 * 用户操作菜单组件
 *
 * 提供一个下拉菜单用于执行用户相关操作（编辑、删除）
 *
 * @param user 要操作的用户对象
 * @param disabled 是否禁用菜单按钮
 */
export const UserActionsMenu = ({ user, disabled }: UserActionsMenuProps) => {
  return (
    // 菜单根组件
    <MenuRoot>
      {/* 菜单触发按钮 */}
      <MenuTrigger asChild>
        <IconButton
          variant="ghost" // 透明背景样式
          color="inherit" // 继承父元素颜色
          disabled={disabled} // 禁用状态
          aria-label="用户操作菜单" // 无障碍标签
        >
          {/* 垂直三点图标 */}
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>

      {/* 菜单内容 */}
      <MenuContent>
        {/* 编辑用户组件 */}
        <EditUser user={user} />

        {/* 删除用户组件 */}
        <DeleteUser id={user.id} />
      </MenuContent>
    </MenuRoot>
  )
}