import uuid

from sqlmodel import Session

from app.models import Task, TaskCreate


def crud_create_task(*, session: Session, task_in: TaskCreate, project_id: uuid.UUID, owner_id: uuid.UUID) -> Task:
    db_task = Task.model_validate(task_in, update={"project_id": project_id, "owner_id": owner_id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task
