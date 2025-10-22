import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.api.deps.common import SessionDep
from app.api.deps.users import CurrentUser

from app.models import (
    TaskPublic,
    TaskCreate,
    Project
)

from app.crud.tasks import crud_create_task

router = APIRouter(prefix="/projects", tags=["任务"])


@router.post("/{project_id}/tasks", response_model=TaskPublic)
def create_task(
        session: SessionDep,
        current_user: CurrentUser,
        project_id: uuid.UUID,
        task_data: TaskCreate
) -> Any:
    # 检查用户是否有权限在 project 下创建 task
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # 检查用户是否是 project 所有者或协作者
    if current_user.id != project.owner_id and current_user not in project.collaborators:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )

    # 创建任务
    task = crud_create_task(session=session, task_in=task_data, project_id=project_id, owner_id=current_user.id)
    return task

# @router.put("/{project_id}/tasks/{task_id}", response_model=TaskPublic)
# def update_task(
#         session: SessionDep,
#         current_user: CurrentUser,
#         project_id: uuid.UUID,
#         task_id: uuid.UUID,
#         task_data: TaskUpdate
# ) -> Any:
#     # 检查用户是否有权限编辑 task
#     task = session.get(Task, task_id)
#     if not task:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
#
#     #
