from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pymysql
from datetime import datetime

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # allow frontend (React) to call APIs

# MySQL connection
db = pymysql.connect(
    host="localhost",
    user="root",
    password="****",
    database="feedbackapp"
)
cursor = db.cursor(pymysql.cursors.DictCursor)

# --------------------------
# Admin View API
# --------------------------

@app.route("/api/admin_feedbacks", methods=["GET"])
def admin_feedbacks():
    try:
        # create a fresh cursor each time
        cursor = db.cursor()

        cursor.execute("""
            SELECT 
                f.feedback, 
                f.created_at, 
                CASE 
                    WHEN f.is_anonymous = 1 THEN 'Anonymous'
                    ELSE c.name
                END as customer_name
            FROM feedback f
            JOIN customer c ON f.user_id = c.id
            ORDER BY f.created_at DESC
        """)
        rows = cursor.fetchall()
        cursor.close()  # ✅ close only cursor, keep db alive

        feedbacks = [
            {
                "feedback": r[0],
                "created_at": r[1],
                "customer_name": r[2]
            }
            for r in rows
        ]
        return jsonify(feedbacks), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



# --------------------------
# Submit Feedback API
# --------------------------
@app.route('/api/new_feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    user_id = data.get('user_id')
    feedback = data.get('feedback')
    is_anonymous = data.get('is_anonymous', False)

    try:
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO feedback (user_id, feedback, is_anonymous)
            VALUES (%s, %s, %s)
        """, (user_id, feedback, is_anonymous))
        db.commit()
        return jsonify({"message": "Feedback submitted successfully"}), 201
    except Exception as e:
        print("Error inserting feedback:", e)  # <-- shows in your terminal
        return jsonify({"error": str(e)}), 500
    

# --------------------------
# Show Feedback API
# --------------------------

@app.route("/api/show_feedback", methods=["GET"])
def show_feedback():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    try:
        user_id = int(user_id)

        # create connection inside route
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="****",
            database="feedbackapp",
            cursorclass=pymysql.cursors.DictCursor  # returns dict instead of tuple
        )
        cursor = conn.cursor()

        cursor.execute(
            "SELECT feedback, created_at FROM feedback WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(rows), 200  # already dicts thanks to DictCursor
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



# --------------------------
# Customer Signup API
# --------------------------
@app.route('/api/customer/signup', methods=['POST'])
def customer_signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # hash password
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        cursor.execute("""
            INSERT INTO customer (name, email, password_hash, created_at)
            VALUES (%s, %s, %s, %s)
        """, (name, email, pw_hash, datetime.now()))
        db.commit()
        return jsonify({"message": "Signup successful!"}), 201
    except pymysql.Error as err:
        return jsonify({"error": str(err)}), 400

# --------------------------
# Customer Login API
# --------------------------
@app.route('/api/customer/login', methods=['POST'])
def customer_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        # Check if user exists
        cursor.execute("SELECT * FROM customer WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Compare hashed password
        if bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({
                "message": "Login successful!",
                "customer": {
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "created_at": user['created_at']
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except pymysql.Error as err:
        return jsonify({"error": str(err)}), 500

# --------------------------
# Admin Login API
# --------------------------
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        cursor.execute("SELECT * FROM admin WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({
                "message": "Admin login successful!",
                "role": "admin",
                "admin": {
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email']
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except pymysql.Error as err:
        return jsonify({"error": str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True)

