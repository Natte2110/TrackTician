from tracktician import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class Users(db.Model, UserMixin):
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    group = db.Column(db.Integer, db.ForeignKey("groups.id", ondelete="CASCADE"))
    surname = db.Column(db.String(32), nullable=False)
    active = db.Column(db.Boolean, default=False, nullable=False)
    
    def __repr__(self):
        # Determine if the user is active or not
        active_status = "Active" if self.active else "Inactive"
        
        # Build the representation string
        return f"<User #{self.id}: Username='{self.username}', Group='{self.group}', Surname='{self.surname}', Status='{active_status}'>"
    
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
        return f"<Group: {self.name}>"
