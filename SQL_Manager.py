import sqlite3
import uuid


class SQL_Manager:
    
        def __init__(self, db_file):
            self.db_file = db_file
            self.create_tables()
        
        def _get_connection(self):
            return sqlite3.connect(self.db_file)

    
        def create_tables(self):
            with self._get_connection() as conn:
                cursor = conn.cursor()

                # Create User table
                cursor.execute('''CREATE TABLE IF NOT EXISTS User (
                                    id TEXT PRIMARY KEY,
                                    username TEXT,
                                    password TEXT
                                )''')

                conn.commit()
                
        
        def login(self, name, password):
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM User WHERE username = ? AND password = ?", (name, password))
                user_id = cursor.fetchone()
                if user_id:
                    return True, name
                return None

        def signup(self, name, password):
            with self._get_connection() as conn:
                cursor = conn.cursor()
                user_id = str(uuid.uuid4())
                cursor.execute("INSERT INTO User (id, username, password) VALUES (?, ?, ?)", (user_id, name, password))
                conn.commit()
                return True, name
        
        