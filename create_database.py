from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker
from tracktician.models import Users, Groups, Drivers, Meetings, Sessions
import os
import json
from urllib.request import urlopen

if os.path.exists("env.py"):
    import env  # noqa

engine = create_engine(os.environ.get("DB_URL"))
Session = sessionmaker(bind=engine)

Users.metadata.create_all(engine)

session = Session()


def create_default_user(session):
    # Check if the group "Administrator" already exists
    admin_group_exists = session.query(
        exists().where(Groups.name == "Administrator")).scalar()

    # If the group doesn't exist, add it
    if not admin_group_exists:
        admin_group = Groups(name="Administrator")
        session.add(admin_group)
        session.commit()

    # Check if the user "admin" already exists
    admin_user_exists = session.query(
        exists().where(Users.username == "admin")).scalar()

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


def add_meetings(session, year):
    response = urlopen(f'https://api.openf1.org/v1/meetings?year={year}')
    data = json.loads(response.read().decode('utf-8'))

    for meeting_data in data:
        existing_meeting = session.query(Meetings).filter_by(
            meeting_key=meeting_data["meeting_key"]).first()
        if existing_meeting:
            continue

        meeting = Meetings(
            meeting_key=meeting_data["meeting_key"],
            circuit_key=meeting_data["circuit_key"],
            circuit_short_name=meeting_data["circuit_short_name"],
            country_name=meeting_data["country_name"],
            date_start=meeting_data["date_start"],
            location=meeting_data["location"],
            meeting_official_name=meeting_data["meeting_official_name"],
            year=meeting_data["year"]
        )
        session.add(meeting)

    session.commit()


def add_sessions(session):
    all_meetings = session.query(Meetings).all()

    for meeting in all_meetings:
        meeting_key = meeting.meeting_key
        url = f"https://api.openf1.org/v1/sessions?meeting_key={meeting_key}"

        response = urlopen(url)
        data = json.loads(response.read().decode('utf-8'))

        for session_data in data:
            existing_session = session.query(Sessions).filter_by(
                session_key=session_data["session_key"]).first()
            if existing_session:
                continue

            session_obj = Sessions(
                session_key=session_data["session_key"],
                date_end=session_data["date_end"],
                date_start=session_data["date_start"],
                meeting_key=session_data["meeting_key"],
                session_name=session_data["session_name"],
                session_type=session_data["session_type"]
            )
            session.add(session_obj)

    session.commit()


def add_drivers(session):
    all_sessions = session.query(Sessions).all()

    for session_obj in all_sessions:
        session_key = session_obj.session_key
        url = f"https://api.openf1.org/v1/drivers?session_key={session_key}"

        response = urlopen(url)
        data = json.loads(response.read().decode('utf-8'))

        for driver_data in data:
            existing_driver = session.query(Drivers).filter_by(
                session_key=driver_data["session_key"]).first()
            if existing_driver:
                continue

            driver = Drivers(
                driver_number=driver_data["driver_number"],
                full_name=driver_data["full_name"],
                headshot_url=driver_data["headshot_url"],
                name_acronym=driver_data["name_acronym"],
                session_key=driver_data["session_key"],
                team_colour=driver_data["team_colour"],
                team_name=driver_data["team_name"]
            )
            session.add(driver)

    session.commit()


create_default_user(session)

add_meetings(session, year=2023)

add_sessions(session)

add_drivers(session)
