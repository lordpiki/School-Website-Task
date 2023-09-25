from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import subprocess
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import secrets


secret_key = secrets.token_hex(16) 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  
app.config['SECRET_KEY'] = secret_key  
db = SQLAlchemy(app)




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    

class GameResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    outcome = db.Column(db.String(20), nullable=False)  # 'win', 'lose', or 'draw'


@app.route('/')
def index():
    return render_template('login.html')

@app.route('/about_page')
def about_page():
    return render_template('about_page.html')

def check_password(password):
    if len(password) < 8:
        return "Password has to be longer than 8 characters"
    
    elif not any(char.isdigit() for char in password):
        return "Password must have at least 1 number in it"
    
    elif not any(char.isupper() for char in password):
        return "Password must have at least 1 upper case character in it"
    
    else:
        return True
    
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            return render_template('signup.html', message="Passwords don't match!")
        

        password_check = check_password(password)
        
        if password_check != True:
            return render_template('signup.html', message=password_check)

        # Check if the username is already taken
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return render_template('signup.html', message='Username already exists.')

        # Create a new user record
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('login', message='Signup successful'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['user_id'] = user.id  # Store user ID in the session
            return redirect(url_for('tic_tac_toe'))

        return render_template('login.html', message='Invalid credentials. Please try again.', login_successful=False)

    return render_template('login.html',  login_successful=True)

@app.route('/scoreboard')
def scoreboard():
    
    user_id = session.get('user_id') 
    if user_id == None:
        return render_template('login.html', message='Please login first')

    user = User.query.get(user_id)
    results = GameResult.query.filter_by(user_id=user_id).all()[:10]
    return render_template("scoreboard.html", user=user, results=reversed(results))

@app.route('/tic_tac_toe')
def tic_tac_toe():
    user_id = session.get('user_id') 
    if user_id == None:
        return render_template('login.html', message='Please login first')

    return render_template("tic_tac_toe.html")


@app.route('/api/play', methods=['POST'])
def play_move():
    current_board = request.json['board']
    turn = request.json['turn']


    print("here")

    # Format the current board as a space-separated string of numbers
    current_board_str = ' '.join(str(move) for move in current_board)
    print("sent board", current_board_str)

    # Replace the path to the compiled tic_tac_toe.exe file with the actual path on your system
    # The subprocess call will execute the C program and pass the current board and player's move as arguments
    result = subprocess.run(['Tic-Tac-Toe Bot.exe', current_board_str, str(turn)], capture_output=True, text=True)
    print("res: ")
    print(result.stdout)
    print(result.stderr)
    if 0 not in current_board:
        game_result = GameResult(user_id=session.get('user_id'), outcome='tie')
        db.session.add(game_result)
        db.session.commit()    
        print("tie") 
        return render_template("base.html", board=current_board)
        # insert code here


    # Parse the C program's response to get the bot's move
    try:
        bot_move = parse_bot_move(result.returncode)
    except ValueError:
        # Handle the case where the C program returned an invalid response or an error occurred
        return jsonify({'error': 'An error occurred during the game.'}), 500

    response = {
        'bot_move': bot_move
    }
    
    current_board[bot_move] = 2
        
    
    print("win?", check_tic_tac_toe(current_board))
    win = check_tic_tac_toe(current_board)
    
    if win == 1:
        print("X win")
        game_result = GameResult(user_id=session.get('user_id'), outcome='win')
        db.session.add(game_result)
        db.session.commit() 
    elif win == 2:
        print("o win")
        game_result = GameResult(user_id=session.get('user_id'), outcome='loss')
        db.session.add(game_result)
        db.session.commit() 
    elif win == -1:
        print("tie")
        game_result = GameResult(user_id=session.get('user_id'), outcome='tie')
        db.session.add(game_result)
        db.session.commit()         
       
    print(session.get('user_id'))
        

    return jsonify(response)


def parse_bot_move(stdout):
    # This function parses the C program's response to extract the bot's move
    # Replace this with your actual logic based on your C program's output format
    # For example, if the C program returns just the bot's move as a single number (0-8), you can simply return it.
    return int(stdout)


def check_tic_tac_toe(board):
    # Define the winning combinations
    win_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]

    # Check for a win
    for combination in win_combinations:
        if board[combination[0]] == board[combination[1]] == board[combination[2]] != 0:
            return board[combination[0]]

    # Check for a tie or game still going
    if 0 not in board:
        return -1  # Tie
    else:
        return 0  # Game still going




if __name__ == '__main__':
    with app.app_context():  # Create an application context
        db.create_all()
    app.run(debug=True)
