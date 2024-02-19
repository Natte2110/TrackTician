from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker
from tracktician.models import Users, Groups
import os, json
from urllib.request import urlopen 

if os.path.exists("env.py"):
    import env  # noqa

engine = create_engine(os.environ.get("DB_URL"))
Session = sessionmaker(bind=engine)

Users.metadata.create_all(engine)

session = Session()

def create_default_user(session):
    # Check if the group "Administrator" already exists
    admin_group_exists = session.query(exists().where(Groups.name == "Administrator")).scalar()

    # If the group doesn't exist, add it
    if not admin_group_exists:
        admin_group = Groups(name="Administrator")
        session.add(admin_group)
        session.commit()

    # Check if the user "admin" already exists
    admin_user_exists = session.query(exists().where(Users.username == "admin")).scalar()

    # If the user doesn't exist, add it
    if not admin_user_exists:
        default_user = Users(
            username=os.environ.get("DEFAULT_USER_USERNAME"),
            password=os.environ.get("DEFAULT_USER_PASSWORD"),
            group=int(os.environ.get("DEFAULT_USER_GROUP")),
            surname=os.environ.get("DEFAULT_USER_SURNAME"),
            active=bool(os.environ.get("DEFAULT_USER_ACTIVE"))
        )
        session.add(default_user)
        session.commit()

create_default_user(session)