# Online Voting System (OVS)

## Overview
The Online Voting System (OVS) is a web-based application designed to facilitate secure and efficient voting processes. It includes features for voter registration, candidate assignment, election management, and real-time vote counting.

## Features
- **Admin Panel**: Manage elections, assign candidates, and verify voter registrations.
- **Voter Registration**: Users can register and upload required documents for verification.
- **Election Management**: Admins can create elections and assign candidates.
- **Voting**: Users can cast their votes securely.
- **Real-Time Results**: Display vote counts and results using charts.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Axios, SweetAlert2
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Charting**: Chart.js

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/online-voting-system.git
   cd online-voting-system
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../server
   npm install
   ```

3. Set up the database

- Open your MySQL client (e.g., **MySQL Workbench**, **phpMyAdmin**, or **terminal**).

- Navigate to the `sql` folder in the repository. You will find the following two files:
   - **`db_create_query.txt`** – Contains SQL statements to create the **database**, **tables**, and **triggers**.
   - **`db_insert_query.txt`** – Contains initial data to **populate the database**.

- Execute the SQL scripts in the following order:
   - First, run the contents of `db_create_query.txt` to set up the database structure.
   - Then, run the contents of `db_insert_query.txt` to insert sample or initial data.




4. Start the backend development server:
   ```bash
   cd server
   npm run dev
   ```

5. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Usage
1. Open the application in your browser at `http://localhost:3000`.
2. Admins can log in using the credentials specified in the `.env` file.
3. Users can register, upload documents, and vote in active elections.

## License
This project is licensed under the MIT License.

## Acknowledgments
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [Chart.js](https://www.chartjs.org/)
