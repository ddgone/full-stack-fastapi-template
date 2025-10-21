import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    TaskPublic,
    TaskCreate,
    TaskUpdate,
    Task,
    Project
)

router = APIRouter(prefix="/items", tags=["tasks"])


@router.post("/{item_id}/tasks", response_model=TaskPublic)
def create_task(
        session: SessionDep,
        current_user: CurrentUser,
        item_id: uuid.UUID,
        task_data: TaskCreate
) -> Any:
    # 检查用户是否有权限在 item 下创建 task
    item = session.get(Project, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    # 检查用户是否是 item 所有者或协作者
    if current_user.id != item.owner_id and current_user not in item.collaborators:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )

    # 创建任务
    task = Task(**task_data.model_dump(), item_id=item_id, owner_id=current_user.id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


# @router.put("/{item_id}/tasks/{task_id}", response_model=TaskPublic)
# def update_task(
#         session: SessionDep,
#         current_user: CurrentUser,
#         item_id: uuid.UUID,
#         task_id: uuid.UUID,
#         task_data: TaskUpdate
# ) -> Any:
#     # 检查用户是否有权限编辑 task
#     task = session.get(Task, task_id)
#     if not task:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
#
#     #