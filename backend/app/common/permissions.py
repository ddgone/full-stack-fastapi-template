from app.models import Task, User

def has_task_read_access(task: Task, user: User) -> bool:
    """检查用户是否有读取任务的权限"""
    # 任务负责人或协作者有完整权限
    if user.id == task.owner_id or user in task.collaborators:
        return True

    # 获取关联的 item
    item = task.item

    # Item 所有者或协作者有只读权限
    if user.id == item.owner_id or user in item.collaborators:
        return True

    return False

def has_task_edit_access(task: Task, user: User) -> bool:
    """检查用户是否有编辑任务的权限"""
    # 任务负责人有完整权限
    if user.id == task.owner_id:
        return True

    # 任务协作者有编辑权限
    if user in task.collaborators:
        return True

    return  False