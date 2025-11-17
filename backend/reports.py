# backend/reports.py
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React

# Database configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",  # add your root password if any
    "database": "done_with_it"
}

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

# Ensure the reports table exists
def create_reports_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

create_reports_table()  # create table at startup

# Endpoint to submit report
@app.route("/api/report", methods=["POST"])
def submit_report():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO reports (name, email, message) VALUES (%s, %s, %s)"
    cursor.execute(sql, (name, email, message))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success", "message": "Report submitted successfully"})

# Optional: endpoint to fetch reports
@app.route("/api/reports", methods=["GET"])
def get_reports():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reports ORDER BY created_at DESC")
    reports = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(reports)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
