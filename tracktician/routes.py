from flask import render_template, request, redirect, url_for, jsonify
from tracktician import app, db
from tracktician.models import Users, Groups, Drivers, Meetings, Sessions
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from datetime import datetime

login_manager = LoginManager(app)
login_manager.login_view = 'log_in'


def replace_missing_vals(session_id):
    all_drivers = Drivers.query.filter_by(session_key=session_id).all()
    unique_drivers = []
    seen_driver_numbers = set()
    for driver in all_drivers:
        driver_dict = driver.as_dict()
        driver_number = driver_dict['driver_number']
        if driver_number not in seen_driver_numbers:
            seen_driver_numbers.add(driver_number)
            if driver_dict['headshot_url'] is None:
                fallback_driver = Drivers.query.filter(
                    Drivers.driver_number == driver_number,
                    Drivers.headshot_url.isnot(None) 
                ).first()
                if fallback_driver:
                    driver_dict['headshot_url'] = fallback_driver.headshot_url
            if driver_dict['team_colour'] is None:
                fallback_driver = Drivers.query.filter(
                    Drivers.driver_number == driver_number,
                    Drivers.team_colour.isnot(None) 
                ).first()
                if fallback_driver:
                    driver_dict['team_colour'] = fallback_driver.team_colour
            if driver_dict['team_name'] is None:
                fallback_driver = Drivers.query.filter(
                    Drivers.driver_number == driver_number,
                    Drivers.team_name.isnot(None) 
                ).first()
                if fallback_driver:
                    driver_dict['team_name'] = fallback_driver.team_name
            unique_drivers.append(driver_dict)
    return unique_drivers


@login_manager.user_loader
def load_user(id):
    """Loads the current user and returns it as a query object.

    Arguments:
        id -- The id of the user, this will be used to search the
        USERS database table for the corresponding entry.

    Returns:
        A User object returned from a query on the Users table.
    """
    return Users.query.get(int(id))


@app.route("/", methods=["GET", "POST"])
def dashboard():
    session_id = request.args.get('sessionID')

    session = Sessions.query.filter_by(session_key=session_id).first()
    session_dict = session.as_dict() if session else {}

    drivers = replace_missing_vals(session_id)
    
    return render_template("dashboard.html", title="Dashboard", session=session_dict, drivers=drivers)


@app.route('/get-session', methods=['GET'])
def get_session():
    session_id = request.args.get('sessionID')

    session = Sessions.query.filter_by(session_key=session_id).first()

    session_dict = session.as_dict() if session else {}
    
    drivers = replace_missing_vals(session_id)
    # session_dict['drivers'] = [driver.as_dict() for driver in drivers]
    session_dict['drivers'] = drivers
    return jsonify(session_dict)


@app.route('/simulate-race', methods=['POST'])
def simulate_race():
    data = request.json
    session_id = data.get('sessionID')

    return jsonify({"success": True, "sessionID": session_id})


@app.route("/races")
def races():
    """Provides routing for the website's Race History page

    Returns:
        The races.html page with the title of "Race History"
    """
    sessions = Sessions.query.all()
    for session in sessions:
        meeting = Meetings.query.filter_by(meeting_key=session.meeting_key).first()
        session.circuit_short_name = meeting.circuit_short_name
        session.location = meeting.location
    return render_template("races.html", title="Race History", sessions=sessions)


@app.route("/log-in", methods=["GET", "POST"])
def log_in():
    """
    Handles user logins by checking if the
    details are within the the user table.

    Returns:
        The home page upon successful login.
    """
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = Users.query.filter_by(username=username).first()
        if user:
            if user.verify_password(password):
                login_user(user)
                return jsonify({"success": True})
            else:
                return jsonify({"success": False, "message":"Incorrect Combination"})
        else:
                return jsonify({"success": False, "message":"Incorrect Combination"})
    return render_template("login.html", title="Log In")


@app.route("/logout")
@login_required
def logout():
    """Logs the user out of their account

    Returns:
        The home page.
    """
    logout_user()
    return redirect(url_for('dashboard'))


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


# @app.errorhandler(500)
# def internal_server_error(error):
#     return render_template('500.html'), 500