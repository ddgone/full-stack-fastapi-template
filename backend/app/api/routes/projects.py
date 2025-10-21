import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Project,
    ProjectCreate,
    ProjectPublic,
    ProjectsPublic,
    ProjectUpdate,
    Message
)

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=ProjectsPublic)
def read_projects(
        session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    检索项目.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Project)
        count = session.exec(count_statement).one()
        statement = select(Project).offset(skip).limit(limit)
        projects = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Project)
            .where(Project.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Project)
            .where(Project.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        projects = session.exec(statement).all()

    return ProjectsPublic(data=projects, count=count)


@router.get("/{id}", response_model=ProjectPublic)
def read_project(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get project by ID.
    """
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_superuser and (project.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return project


@router.post("/", response_model=ProjectPublic)
def create_project(
        *, session: SessionDep, current_user: CurrentUser, project_in: ProjectCreate
) -> Any:
    """
    Create new project.
    """
    project = Project.model_validate(project_in, update={"owner_id": current_user.id})
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.put("/{id}", response_model=ProjectPublic)
def update_project(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        project_in: ProjectUpdate,
) -> Any:
    """
    Update an project.
    """
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_superuser and (project.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = project_in.model_dump(exclude_unset=True)
    project.sqlmodel_update(update_dict)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.delete("/{id}")
def delete_project(
        session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an project.
    """
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not current_user.is_superuser and (project.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(project)
    session.commit()
    return Message(message="Project deleted successfully")
