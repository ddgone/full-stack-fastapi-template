import uuid

from sqlmodel import Session

from app.models import Project, ProjectCreate


def crud_create_project(*, session: Session, project_in: ProjectCreate, owner_id: uuid.UUID) -> Project:
    db_project = Project.model_validate(project_in, update={"owner_id": owner_id})
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project
