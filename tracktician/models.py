from tracktician import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), unique=True, nullable=False)
    _password_hash = db.Column(db.String(64), nullable=False)
    group = db.Column(
        db.Integer,
        db.ForeignKey("groups.id", ondelete="CASCADE")
    )
    surname = db.Column(db.String(32), nullable=False)
    active = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return "#{0} - Username: {1}, Group: {2}, Surname: {3}".format(
            self.id, self.username, self.group, self.surname
        )

    @property
    def password(self):
        raise AttributeError('Password is not readable')

    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self._password_hash, password)


class Groups(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(16), unique=True, nullable=False)

    def __repr__(self):
        return "Group: {}".format(self.name)


class Drivers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    driver_number = db.Column(db.Integer)
    full_name = db.Column(db.String(255))
    headshot_url = db.Column(db.String(255))
    name_acronym = db.Column(db.String(50))
    session_key = db.Column(
        db.Integer,
        db.ForeignKey("sessions.id", ondelete="CASCADE")
    )
    team_colour = db.Column(db.String(6))
    team_name = db.Column(db.String(255))

    def __repr__(self):
        return "Driver: {0} (#{1})".format(self.full_name, self.driver_number)


class Sessions(db.Model):
    session_key = db.Column(db.Integer, primary_key=True)
    date_end = db.Column(db.DateTime)
    date_start = db.Column(db.DateTime)
    meeting_key = db.Column(
        db.Integer,
        db.ForeignKey("meetings.id", ondelete="CASCADE")
    )
    session_name = db.Column(db.String(255))
    session_type = db.Column(db.String(255))

    def __repr__(self):
        return "Session: {0} ({1} - {2})".format(
            self.session_name, self.date_start, self.date_end
        )


class Meetings(db.Model):
    meeting_key = db.Column(db.Integer, primary_key=True)
    circuit_key = db.Column(db.Integer)
    circuit_short_name = db.Column(db.String(255))
    country_name = db.Column(db.String(255))
    date_start = db.Column(db.DateTime)
    location = db.Column(db.String(255))
    meeting_official_name = db.Column(db.String(255))
    year = db.Column(db.Integer)

    def __repr__(self):
        return "Meeting: {0} - {1} ({2})".format(
            self.location, self.meeting_official_name, self.date_start
        )
