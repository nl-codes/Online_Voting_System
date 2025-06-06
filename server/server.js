import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
    uploadCandidate,
    uploadCitizenship,
    uploadUserProfile,
} from "./middleware/multerConfig.js";
import transporter from "./config/nodemailerConfig.js";
import crypto from "crypto";

import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

// Create connection pool instead of single connection
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "online_voting_system",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test database connection
pool.getConnection()
    .then((connection) => {
        console.log("Database connected successfully");
        connection.release();
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

// Graceful shutdown
process.on("SIGINT", async () => {
    try {
        await pool.end();
        console.log("Pool connections closed.");
        process.exit(0);
    } catch (err) {
        console.error("Error closing pool connections:", err);
        process.exit(1);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Date Validation Function
const isValidDate = (dateString) => {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return false;

    // Parse the date parts
    const [year, month, day] = dateString.split("-").map(Number);

    // Check year range (assuming reasonable range between 1900 and current year)
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) return false;

    // Check month (1-12)
    if (month < 1 || month > 12) return false;

    // Check day based on month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    return true;
};

// Register user
app.post("/user_register", async (req, res) => {
    const sql =
        "INSERT INTO user_detail (first_name, last_name, email, password_hash, dob) VALUES (?,?,?,?,?)";

    try {
        const { first_name, last_name, email, password, dob } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !password || !dob) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Validate date format and reasonableness
        if (!isValidDate(dob)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format or unreasonable date",
            });
        }

        // Calculate age
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        // Check if age is at least 18
        if (age < 18 || age > 120) {
            return res.status(400).json({
                success: false,
                message:
                    age < 18
                        ? "Must be at least 18 years old to register"
                        : "Invalid age",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const values = [first_name, last_name, email, hashedPassword, dob];

        const [result] = await pool.execute(sql, values);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result.insertId,
        });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
});

// Login user
app.post("/user_login", async (req, res) => {
    const sql = "SELECT * FROM `user_detail` WHERE `email` = ?";
    const { email, password } = req.body;

    try {
        const [users] = await pool.execute(sql, [email]);

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }

        return res.json({
            success: true,
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            dob: user.dob,
            photo_url: user.photo_url,
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            error: "Database error: " + err.message,
        });
    }
});

// Check if the email exists or not
app.get("/user_exists/:email", async (req, res) => {
    const sql = "SELECT * FROM `user_detail` WHERE `email` = ?";

    try {
        const [result] = await pool.execute(sql, [req.params.email]);
        return res.json({
            success: true,
            exists: result.length > 0,
        });
    } catch (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({
            success: false,
            error: "Database error: " + err.message,
        });
    }
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Missing Email field",
        });
    }
    try {
        const getIdSql = "SELECT id FROM user_detail WHERE email = ?";

        const [user] = await pool.execute(getIdSql, [email]);

        if (user.length == 0) {
            return res.status(200).json({
                success: false,
                error: "No user found with this email",
            });
        }

        const userId = user[0].id;

        // Generte reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour validity

        // Save reset token in database
        await pool.execute(
            "INSERT INTO reset_password (user_id, reset_token, reset_token_expiry) VALUES (?, ?, ?)",
            [userId, resetToken, resetTokenExpiry]
        );
        // Create reset URL
        const resetUrl = `http://localhost:3001/reset-password/${resetToken}`;

        // Email content using your existing style
        const mailOptions = {
            from: "noreply@ovs.com",
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="background-color: #f6eef8; padding: 20px; border-radius: 10px;">
                <h1 style="color: #29142e; text-align: center;">Password Reset Request</h1>
                <p style="color: #512C59;">You requested a password reset for your OVS account.</p>
                <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" 
                    style="background-color: #564181; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 20px;
                    display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p style="color: #512C59;">This link is valid for 1 hour only.</p>
            <p style="color: #512C59;">If you didn't request this, please ignore this email.</p>
            </div>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Password reset link sent to email",
        });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});

// Verify reset Token
app.get("/verify-reset-token/:token", async (req, res) => {
    const token = req.params.token;
    try {
        const sql =
            "SELECT * FROM reset_password WHERE reset_token = ? AND reset_token_expiry > NOW()";

        const [result] = await pool.execute(sql, [token]);

        if (result.length == 0) {
            return res.status(200).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Valid token",
        });
    } catch (error) {
        console.error("Error verifying password : ", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// Reset Password
app.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing required Fields",
        });
    }
    try {
        const tokenSql =
            "SELECT * FROM reset_password WHERE reset_token = ? AND reset_token_expiry > NOW()";

        const [tokenResult] = await pool.execute(tokenSql, [token]);

        if (tokenResult.length == 0) {
            return res.status(200).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        const updateSql =
            "UPDATE user_detail SET password_hash = ? WHERE id = ?";

        const updateValues = [hashedPassword, tokenResult[0].user_id];

        await pool.execute(updateSql, updateValues);

        // Delete used token
        const deleteSql = "DELETE FROM reset_password WHERE reset_token = ?";

        const deleteValues = [token];

        await pool.execute(deleteSql, deleteValues);

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.error("Erroring resetting password: ", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// Profile Fetch
app.get("/user_profile/:id", async (req, res) => {
    const sql =
        "SELECT first_name, last_name, email, dob, photo_url, gender, country FROM user_detail WHERE id = ?";

    const [profileResult] = await pool.execute(sql, [req.params.id]);
    if (profileResult.length === 0) {
        return res.status(200).json({
            success: false,
            message: `User with id ${req.params.id} doesn't exist`,
        });
    }
    return res.status(200).json({
        success: true,
        data: profileResult[0],
    });
});

// Profile Update
app.put(
    "/user_profile_update",
    uploadUserProfile.single("photo_url"),
    async (req, res) => {
        try {
            const { userId, gender, country } = req.body;
            let updateFields = [];
            let values = [];

            // Check required fields
            if (!userId || !gender || !country) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Build dynamic SQL query based on provided fields
            if (gender) {
                updateFields.push("gender = ?");
                values.push(gender);
            }
            if (country) {
                updateFields.push("country = ?");
                values.push(country);
            }
            if (req.file) {
                updateFields.push("photo_url = ?");
                values.push(req.file.path);
            }

            // Add userId at the end of values array for WHERE clause
            values.push(userId);

            const sql = `UPDATE user_detail SET ${updateFields.join(
                ", "
            )} WHERE id = ?`;

            await pool.execute(sql, values);

            return res.status(200).json({
                success: true,
                message: "User Profile updated successfully",
            });
        } catch (error) {
            console.error("Update error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error: " + error.message,
            });
        }
    }
);

// Register Candidate
app.post(
    "/candidate_register",
    uploadCandidate.single("photo_url"),
    async (req, res) => {
        try {
            const { full_name, saying } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }

            if (!full_name || !saying) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            const photo_url = req.file.path;
            const sql =
                "INSERT INTO `candidate`(`full_name`, `photo_url`, `saying`) VALUES (?,?,?)";
            const values = [full_name, photo_url, saying];

            const [result] = await pool.execute(sql, values);

            return res.status(201).json({
                success: true,
                message: "Candidate registered successfully",
                data: {
                    id: result.insertId,
                    full_name,
                    saying,
                    photo_url,
                },
            });
        } catch (err) {
            console.error("Server error:", err);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: err.message || "Unknown error",
            });
        }
    }
);

app.put(
    "/edit_candidate/:id",
    uploadCandidate.single("photo_url"),
    async (req, res) => {
        const candidateId = req.params.id;
        try {
            const { full_name, saying } = req.body;

            // Validate required fields
            if (!full_name || !saying) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Check if candidate exists
            const checkSql = "SELECT 1 FROM candidate WHERE id = ?";
            const [checkResult] = await pool.execute(checkSql, [candidateId]);

            if (checkResult.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "No candidate found with this ID",
                });
            }

            // Build dynamic update query based on provided fields
            let updateFields = [];
            let values = [];

            // Always update name and saying
            updateFields.push("full_name = ?", "saying = ?");
            values.push(full_name, saying);

            // Add photo if new one is uploaded
            if (req.file) {
                updateFields.push("photo_url = ?");
                values.push(req.file.path);
            }

            // Add candidate ID at the end for WHERE clause
            values.push(candidateId);

            const updateSql = `UPDATE candidate SET ${updateFields.join(
                ", "
            )} WHERE id = ?`;
            await pool.execute(updateSql, values);

            // Fetch updated candidate details
            const [updatedCandidate] = await pool.execute(
                "SELECT id, full_name, saying, photo_url FROM candidate WHERE id = ?",
                [candidateId]
            );

            return res.status(200).json({
                success: true,
                message: "Candidate updated successfully",
                data: updatedCandidate[0],
            });
        } catch (err) {
            console.error("Error updating candidate:", err);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
    }
);

// Register Election
app.post("/election_register", async (req, res) => {
    try {
        const { topic, description, position, start_time, stop_time } =
            req.body;

        if (!topic || !description || !position || !start_time || !stop_time) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const sql =
            "INSERT INTO `election`(`topic`, `description`, `position`, `start_time`, `stop_time`) VALUES (?,?,?,?,?)";
        const values = [topic, description, position, start_time, stop_time];

        const [result] = await pool.execute(sql, values);

        return res.status(201).json({
            success: true,
            message: "Election created successfully",
            data: {
                id: result.insertId,
                topic,
                description,
                position,
                start_time,
                stop_time,
            },
        });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
});

app.get("/view_ongoing_election_brief", async (req, res) => {
    const sql = `
        SELECT 
            e.id, 
            e.topic, 
            e.description, 
            e.stop_time, 
            GROUP_CONCAT(c.photo_url) AS photo_url_list 
        FROM election_candidate ec 
        JOIN election e ON ec.election_id = e.id 
        JOIN candidate c ON ec.candidate_id = c.id 
        WHERE e.stop_time > NOW()  AND NOW() > e.start_time AND e.isArchived = 0
        GROUP BY e.id
    `;

    try {
        const [result] = await pool.execute(sql);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error fetching elections:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching elections",
            error: err.message,
        });
    }
});

app.get("/finished_election_details", async (req, res) => {
    const sql = `
        SELECT e.id, e.topic, e.description, e.start_time, e.stop_time, e.position, GROUP_CONCAT(c.photo_url SEPARATOR '|') AS candidate_photo_list,
        GROUP_CONCAT(c.full_name SEPARATOR '|') AS candidate_name_list, 
        GROUP_CONCAT(c.saying SEPARATOR '|') AS candidate_saying_list, 
        GROUP_CONCAT(ec.votes SEPARATOR '|') AS candidate_vote_list FROM election_candidate ec JOIN election e ON ec.election_id = e.id JOIN candidate c ON ec.candidate_id = c.id WHERE NOW() > e.stop_time GROUP BY e.id;
    `;

    try {
        const [result] = await pool.execute(sql);

        if (result.length == 0) {
            return res.status(200).json({
                success: false,
                message: "No finished elections found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error fetching elections:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching elections",
            error: err.message,
        });
    }
});

app.get("/view_election_full/:id", async (req, res) => {
    const electionId = req.params.id;

    const sql = `
        SELECT 
            e.id, 
            e.topic, 
            e.description, 
            e.stop_time, 
            e.start_time,
            e.position,
            GROUP_CONCAT(c.photo_url SEPARATOR '|') AS photo_url_list, 
            GROUP_CONCAT(c.full_name SEPARATOR '|') AS candidate_list, 
            GROUP_CONCAT(c.id SEPARATOR '|') AS candidate_id_list, 
            GROUP_CONCAT(c.saying SEPARATOR '|') AS saying_list, 
            GROUP_CONCAT(COALESCE(vote_count, 0) SEPARATOR '|') AS votes_list 
        FROM election_candidate ec 
        JOIN election e ON ec.election_id = e.id 
        JOIN candidate c ON ec.candidate_id = c.id 
        LEFT JOIN (
            SELECT candidate_id, election_id, COUNT(*) AS vote_count 
            FROM votes 
            GROUP BY candidate_id, election_id
        ) v ON v.election_id = e.id AND v.candidate_id = c.id 
        WHERE e.id = ? 
        GROUP BY e.id`;

    try {
        const [result] = await pool.execute(sql, [electionId]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Election not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0],
        });
    } catch (err) {
        console.error("Error fetching election:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching election",
            error: err.message,
        });
    }
});

app.get("/get_all_elections", async (req, res) => {
    const sql = "SELECT * FROM election ";

    try {
        const [electionResult] = await pool.execute(sql);
        if (electionResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No elections found",
            });
        }
        return res.status(200).json({
            success: true,
            data: electionResult,
        });
    } catch (error) {
        console.error("Error fetching elections: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching elections",
        });
    }
});

app.get("/get_future_elections", async (req, res) => {
    const sql =
        "SELECT id, topic, position FROM election WHERE start_time > NOW()";

    try {
        const [result] = await pool.execute(sql);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error fetching elections:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching elections",
            error: err.message,
        });
    }
});

app.get("/get_only_election_detail/:id", async (req, res) => {
    const electionId = req.params.id;

    if (!electionId) {
        return res.status(400).json({
            success: false,
            message: "Missing Election ID",
        });
    }

    const getSql = "SELECT * FROM election WHERE id = ?";

    const [resultGetSql] = await pool.execute(getSql, [electionId]);
    if (resultGetSql.length == 0) {
        return res.status(200).json({
            success: false,
            message: `No election found with id ${electionId}`,
        });
    }

    return res.status(200).json({
        success: true,
        electionData: resultGetSql[0],
    });
});

app.put("/edit_election/:id", async (req, res) => {
    const electionId = req.params.id;

    const { topic, description, position, start_time, stop_time } = req.body;

    if (!electionId) {
        return res.status(400).json({
            success: false,
            message: "Election ID is required",
        });
    }

    if (!topic || !description || !position || !start_time || !stop_time) {
        return res.status(400).json({
            success: false,
            message: "Missing Election data to edit",
        });
    }

    // Check if stop_time is later than start_time
    const startDate = new Date(start_time);
    const stopDate = new Date(stop_time);

    if (stopDate <= startDate) {
        return res.status(200).json({
            success: false,
            message: "Stop time must be later than start time",
        });
    }
    try {
        const sql = "SELECT isArchived FROM election WHERE id = ?";

        const [resultElection] = await pool.execute(sql, [electionId]);

        if (resultElection.length == 0) {
            return res.status(200).json({
                success: false,
                message: "No election with id " + electionId,
            });
        }

        if (!resultElection[0].isArchived) {
            return res.status(200).json({
                success: false,
                message: "Can't edit unarchived election",
            });
        }

        const editSql =
            "UPDATE election SET topic = ?, description = ?, position = ?, start_time = ?, stop_time = ?, isArchived = TRUE WHERE id = ?";

        const editValues = [
            topic,
            description,
            position,
            start_time,
            stop_time,
            electionId,
        ];

        await pool.execute(editSql, editValues);

        return res.status(200).json({
            success: true,
            message: "Election edited successfully",
        });
    } catch (error) {
        console.error("Error editing election: ", error);
        return res.status(500).json({
            status: false,
            message: "Error editing election",
        });
    }
});

app.post("/archive_election", async (req, res) => {
    const { election_id } = req.body;

    if (!election_id) {
        return res.status(400).json({
            success: false,
            message: "Election ID is required",
        });
    }

    try {
        // Step 1: Check if election exists and is ongoing
        const [electionRows] = await pool.execute(
            "SELECT * FROM election WHERE id = ?",
            [election_id]
        );

        if (electionRows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election not found",
            });
        }

        const election = electionRows[0];
        const now = new Date();
        const start = new Date(election.start_time);
        const stop = new Date(election.stop_time);

        if (election.isArchived) {
            return res.status(200).json({
                success: false,
                message: "Election is already archived",
            });
        }

        if (now > stop) {
            return res.status(200).json({
                success: false,
                message: "Only upcoming or ongoing elections can be archived",
            });
        }
        // Step 2: Get candidates and their votes
        const [candidateRows] = await pool.execute(
            "SELECT c.id, c.full_name, ec.votes FROM candidate c JOIN election_candidate ec ON c.id = ec.candidate_id WHERE ec.election_id = ?",
            [election_id]
        );

        const formatDateTime = (date) => {
            return new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        };

        const original_schedule = `${formatDateTime(start)}|${formatDateTime(
            stop
        )}`;

        // Create separate lists for candidates and votes
        const candidate_list = candidateRows
            .map((row) => row.full_name)
            .join("|");
        const votes_list = candidateRows.map((row) => row.votes).join("|");

        // Step 3: Insert into archived_elections with separate lists
        await pool.execute(
            "INSERT INTO archived_elections (original_election_id, original_topic, original_description, original_position, original_schedule, original_candidates, original_votes) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                election_id,
                election.topic,
                election.description,
                election.position,
                original_schedule,
                candidate_list,
                votes_list,
            ]
        );
        // Step 4: Update election as archived
        await pool.execute(
            "UPDATE election SET isArchived = TRUE WHERE id = ?",
            [election_id]
        );
        // Step 5: Reset candidate votes
        await pool.execute(
            "UPDATE election_candidate SET votes = 0 WHERE election_id = ?",
            [election_id]
        );
        await pool.execute("DELETE FROM votes WHERE election_id = ?", [
            election_id,
        ]);
        return res.status(200).json({
            success: true,
            message: "Election archived successfully",
        });
    } catch (error) {
        console.error("Error archiving election:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while archiving election",
        });
    }
});

app.get("/get_archive_elections", async (req, res) => {
    const sql = "SELECT * FROM archived_elections";

    try {
        const [result] = await pool.execute(sql);
        if (result.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No archived elections found",
            });
        }

        return res.status(200).json({
            success: true,
            archivedElections: result,
        });
    } catch (error) {
        console.error("Error fetching archived elections: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching archived elections",
        });
    }
});

app.get("/get_election_archive_status/:id", async (req, res) => {
    const electionId = req.params.id;

    try {
        const sql = "SELECT isArchived FROM election WHERE id = ?";
        const [result] = await pool.execute(sql, [electionId]);

        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Election not found",
            });
        }
        const isArchived = result[0].isArchived === 1 ? true : false;

        return res.status(200).json({
            success: true,
            isArchived: isArchived,
        });
    } catch (error) {
        console.error("Error fetching election archive status: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching election's archive status",
        });
    }
});

app.get("/restart_election/:id", async (req, res) => {
    const electionId = req.params.id;

    try {
        const checkElectionSql = "SELECT 1 FROM election WHERE id = ?";
        const [resultCheckElection] = await pool.execute(checkElectionSql, [
            electionId,
        ]);
        if (resultCheckElection.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Election doesn't exist",
            });
        }

        const checkArchivedSql =
            "SELECT 1 FROM archived_elections WHERE original_election_id = ?";
        const [resultCheckArchive] = await pool.execute(checkArchivedSql, [
            electionId,
        ]);
        if (resultCheckArchive.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election is not archived",
            });
        }

        const checkElectionArchivedStatusSql =
            "SELECT 1 FROM election WHERE id = ? AND isArchived = TRUE";
        const [resultCheckElectionArchivedStatus] = await pool.execute(
            checkElectionArchivedStatusSql,
            [electionId]
        );
        if (resultCheckElectionArchivedStatus.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election is already re-started",
            });
        }
        const updateSql = "UPDATE election SET isArchived = FALSE WHERE id = ?";
        await pool.execute(updateSql, [electionId]);

        return res.status(200).json({
            success: true,
            message: "Election restarted successfully",
        });
    } catch (error) {
        console.error("Error restarting election: ", error);
        return res.status(400).json({
            success: false,
            message: "Error restarting election",
        });
    }
});

app.delete("/delete_election/:id", async (req, res) => {
    const electionId = req.params.id;

    if (!electionId) {
        return res.status(400).json({
            success: false,
            message: "Missing Election Id",
        });
    }

    try {
        const sql = "SELECT isArchived FROM election WHERE id = ?";

        const [resultElection] = await pool.execute(sql, [electionId]);

        if (resultElection.length == 0) {
            return res.status(200).json({
                success: false,
                message: "No election with id " + electionId,
            });
        }

        if (!resultElection[0].isArchived) {
            return res.status(200).json({
                success: false,
                message: "Can't delete unarchived election",
            });
        }

        const deleteSql = "DELETE FROM election WHERE id = ?";

        await pool.execute(deleteSql, [electionId]);

        return res.status(200).json({
            success: true,
            message: "Election deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting election: ", error);
        return res.status(500).json({
            status: false,
            message: "Error deleting election",
        });
    }
});

app.get("/single_candidate_details/:id", async (req, res) => {
    const candidateId = req.params.id;

    if (!candidateId) {
        return res.status(400).json({
            success: false,
            message: "Candidate ID is required",
        });
    }

    try {
        const sql =
            "SELECT id, full_name, photo_url, saying FROM candidate WHERE id = ?";
        const [result] = await pool.execute(sql, [candidateId]);

        if (result.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No candidate found with this ID",
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0],
            message: "Candidate details retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching candidate details:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching candidate details",
            error: error.message,
        });
    }
});

app.get("/get_candidates_all", async (req, res) => {
    const sql = "SELECT id, full_name, photo_url, saying FROM candidate";

    try {
        const [result] = await pool.execute(sql);

        if (result.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No candidates found",
            });
        }
        return res.status(200).json({
            success: true,
            candidateList: result,
        });
    } catch (err) {
        console.error("Error fetching candidates:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching candidates",
            error: err.message,
        });
    }
});

app.post("/check_candidates_assigned", async (req, res) => {
    const { election_id } = req.body;

    if (!election_id) {
        return res.status(400).json({
            success: false,
            message: "Election Id is required",
        });
    }

    try {
        const electionSql = "SELECT 1 FROM election WHERE id = ?";
        const [electionResult] = await pool.execute(electionSql, [election_id]);

        if (electionResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election doesn't exist",
            });
        }

        const candidateSql =
            "SELECT candidate_id FROM election_candidate WHERE election_id = ?";
        const [candidateResult] = await pool.execute(candidateSql, [
            election_id,
        ]);

        if (candidateResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Canidates aren't assigned yet.",
            });
        }

        // Transform candidateResults into an array of candidate IDs
        const candidateIds = candidateResult.map((row) => row.candidate_id);

        return res.status(200).json({
            success: true,
            data: candidateIds,
            message: "Candidates retrieved successfully",
        });
    } catch (err) {
        console.error("Error checking candidate assigned:", err);
        return res.status(500).json({
            success: false,
            message: "Error checking candidate assigned",
            error: err.message,
        });
    }
});

app.post("/get_candidates_assigned", async (req, res) => {
    const { election_id } = req.body;

    if (!election_id) {
        return res.status(400).json({
            success: false,
            message: "Election Id is required",
        });
    }

    try {
        const electionSql = "SELECT 1 FROM election WHERE id = ?";
        const [electionResult] = await pool.execute(electionSql, [election_id]);

        if (electionResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election doesn't exist",
            });
        }

        const candidateSql =
            "SELECT GROUP_CONCAT(ec.candidate_id SEPARATOR '|') AS candidate_id_list, GROUP_CONCAT(c.full_name SEPARATOR '|') AS candidate_full_name, GROUP_CONCAT(c.saying SEPARATOR '|') AS candidate_saying, GROUP_CONCAT(c.photo_url SEPARATOR '|') AS candidate_photo_url FROM election_candidate ec JOIN candidate c ON ec.candidate_id = c.id WHERE ec.election_id = ? GROUP BY ec.election_id";
        const [candidateResult] = await pool.execute(candidateSql, [
            election_id,
        ]);

        if (candidateResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Canidates aren't assigned yet.",
            });
        }

        return res.status(200).json({
            success: true,
            data: candidateResult[0],
            message: "Candidates retrieved successfully",
        });
    } catch (err) {
        console.error("Error checking candidate assigned:", err);
        return res.status(500).json({
            success: false,
            message: "Error checking candidate assigned",
            error: err.message,
        });
    }
});

app.post("/assign_candidate", async (req, res) => {
    const { election_id, candidate_id } = req.body;

    if (!election_id || !candidate_id) {
        return res.status(400).json({
            success: false,
            message: "Election ID and Candidate ID are required",
        });
    }

    try {
        // Check if election exists
        const checkElectionSql = "SELECT 1 FROM election WHERE id = ?";
        const [electionResult] = await pool.execute(checkElectionSql, [
            election_id,
        ]);

        if (electionResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election doesn't exist",
            });
        }

        // Check if candidate exists
        const checkCandidateSql = "SELECT 1 FROM candidate WHERE id = ?";
        const [candidateResult] = await pool.execute(checkCandidateSql, [
            candidate_id,
        ]);

        if (candidateResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Candidate doesn't exist",
            });
        }

        // First delete existing votes for this election
        const deleteVotesSql = "DELETE FROM votes WHERE election_id = ?";
        await pool.execute(deleteVotesSql, [election_id]);

        // Then delete existing candidate assignments
        const deleteAssignmentsSql =
            "DELETE FROM election_candidate WHERE election_id = ?";
        await pool.execute(deleteAssignmentsSql, [election_id]);

        // Finally insert new candidate assignment
        const insertSql =
            "INSERT INTO election_candidate (election_id, candidate_id, votes) VALUES (?, ?, 0)";
        await pool.execute(insertSql, [election_id, candidate_id]);

        return res.status(201).json({
            success: true,
            message: "Candidate assigned successfully",
        });
    } catch (err) {
        console.error("Error assigning candidate:", err);
        return res.status(500).json({
            success: false,
            message: "Error assigning candidate",
            error: err.message,
        });
    }
});

app.post("/check_if_candidate_assigned", async (req, res) => {
    const { candidate_id } = req.body;

    if (!candidate_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    try {
        const checkCandidateSql = "SELECT 1 FROM candidate WHERE id = ?";
        const [checkCandidateResult] = await pool.execute(checkCandidateSql, [
            candidate_id,
        ]);

        if (checkCandidateResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Candidate doesn't exist",
            });
        }

        const candidateSql =
            "SELECT election_id FROM election_candidate WHERE candidate_id = ?";
        const [candidateResult] = await pool.execute(candidateSql, [
            candidate_id,
        ]);

        if (candidateResult.length != 0) {
            return res.status(200).json({
                success: false,
                message: `Candidate is assigned to election ${candidateResult[0].election_id}.`,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Candidates isn't assigned to any election",
        });
    } catch (err) {
        console.error("Error checking candidate assigned:", err);
        return res.status(500).json({
            success: false,
            message: "Error checking candidate assigned",
            error: err.message,
        });
    }
});

app.post("/unassign_candidates_all", async (req, res) => {
    const { election_id } = req.body;

    if (!election_id) {
        return res.status(400).json({
            success: false,
            message: "Election ID is required",
        });
    }

    try {
        const electionExistSQL = "SELECT isArchived FROM election WHERE id = ?";

        const electionExistResult = await pool.execute(electionExistSQL, [
            election_id,
        ]);

        if (electionExistResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Election doesn't exist",
            });
        }
        const deleteSQL = "DELETE FROM votes WHERE election_id = ?";
        await pool.execute(deleteSQL, [election_id]);

        const sql = "DELETE FROM election_candidate WHERE election_id = ?";
        await pool.execute(sql, [election_id]);

        return res.status(201).json({
            success: true,
            message: `Candidate unassigned of election ${election_id} successfully`,
        });
    } catch (err) {
        console.error("Error assigning candidate:", err);
        return res.status(500).json({
            success: false,
            message: "Error assigning candidate",
            error: err.message,
        });
    }
});

app.post("/check_vote_left", async (req, res) => {
    const { voter_id, election_id } = req.body;

    if (!voter_id || !election_id) {
        return res.status(400).json({
            success: false,
            message: "Voter ID, Election ID are required",
        });
    }
    try {
        const [voterExistResult] = await pool.execute(
            "SELECT * from voter_card WHERE voter_id = ?",
            [voter_id]
        );
        if (voterExistResult.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Voter ID isn't registered",
            });
        }

        const [electionExistResult] = await pool.execute(
            "SELECT * from election WHERE id = ?",
            [election_id]
        );
        if (electionExistResult.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Election ID doesn't exist",
            });
        }

        const [voteResult] = await pool.execute(
            "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?",
            [voter_id, election_id]
        );
        if (voteResult.length > 0) {
            return res.status(200).json({
                success: false,
                message: "User has already voted",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "User has not voted yet",
            });
        }
    } catch (error) {
        console.error("Error checking vote:", err);
        return res.status(500).json({
            success: false,
            message: "Error checking vote",
            error: err.message,
        });
    }
});

app.post("/vote", async (req, res) => {
    const { election_id, candidate_id, user_id, voter_id } = req.body;

    if (!election_id || !candidate_id || !user_id || !voter_id) {
        return res.status(400).json({
            success: false,
            message:
                "Election ID, Candidate ID, User ID, Voter ID are required",
        });
    }

    try {
        // Check if user exists
        const [userResult] = await pool.execute(
            "SELECT EXISTS(SELECT 1 FROM user_detail WHERE id = ?) AS user_exist",
            [user_id]
        );

        if (!userResult[0].user_exist) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Check if voter exists and is verified
        const [voterResult] = await pool.execute(
            "SELECT verification_status FROM voter_card WHERE voter_id = ?",
            [voter_id]
        );

        if (!voterResult.length) {
            return res.status(400).json({
                success: false,
                message: "Voter ID isn't registered",
            });
        }

        if (voterResult[0].verification_status === 0) {
            return res.status(400).json({
                success: false,
                message: "Voter ID isn't verified",
            });
        }

        // Check if election exists and is active
        const [electionResult] = await pool.execute(
            "SELECT start_time, stop_time FROM election WHERE id = ?",
            [election_id]
        );

        if (electionResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Election not found",
            });
        }

        const currentTime = new Date();
        const startTime = new Date(electionResult[0].start_time);
        const stopTime = new Date(electionResult[0].stop_time);

        if (currentTime < startTime) {
            return res.status(400).json({
                success: false,
                message: "Voting has not started yet",
                starts_in:
                    Math.ceil((startTime - currentTime) / (1000 * 60)) +
                    " minutes",
            });
        }

        if (currentTime > stopTime) {
            return res.status(400).json({
                success: false,
                message: "Voting has ended",
                ended:
                    Math.floor((currentTime - stopTime) / (1000 * 60)) +
                    " minutes ago",
            });
        }

        // Check if candidate exists
        const [candidateResult] = await pool.execute(
            "SELECT EXISTS(SELECT 1 FROM candidate WHERE id = ?) AS candidate_exist",
            [candidate_id]
        );

        if (!candidateResult[0].candidate_exist) {
            return res.status(400).json({
                success: false,
                message: "Candidate does not exist",
            });
        }

        // Check if user has already voted
        const [voteResult] = await pool.execute(
            "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?",
            [voter_id, election_id]
        );

        if (voteResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User has already voted in this election",
            });
        }

        // Insert vote
        await pool.execute(
            "INSERT INTO votes (election_id, candidate_id, voter_id) VALUES (?, ?, ?)",
            [election_id, candidate_id, voter_id]
        );

        return res.status(201).json({
            success: true,
            message: "Vote cast successfully",
        });
    } catch (err) {
        console.error("Error voting:", err);
        return res.status(500).json({
            success: false,
            message: "Error voting",
            error: err.message,
        });
    }
});

// Register Voter_card
app.post(
    "/voter_card_register",
    uploadCitizenship.fields([
        { name: "citizenship_front_pic", maxCount: 1 },
        { name: "citizenship_back_pic", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { citizenship_number, phone_number, user_id } = req.body;

            if (!citizenship_number || !phone_number || !user_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Validate Nepal phone number
            const nepalPhoneRegex = /^9[7-8][0-9]{8}$/;
            if (!nepalPhoneRegex.test(phone_number)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Nepal phone number format",
                });
            }

            // Ensure images were uploaded
            if (
                !req.files ||
                !req.files.citizenship_front_pic ||
                !req.files.citizenship_back_pic
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Both citizenship front and back images are required",
                });
            }

            const citizenship_front_pic =
                req.files.citizenship_front_pic[0].path;
            const citizenship_back_pic = req.files.citizenship_back_pic[0].path;

            // Check existing records
            const [checkResult] = await pool.execute(
                "SELECT * FROM voter_card WHERE citizenship_number = ? OR phone_number = ?",
                [citizenship_number, phone_number]
            );

            if (checkResult.length > 0) {
                const existingRecord = checkResult[0];
                return res.status(400).json({
                    success: false,
                    message:
                        existingRecord.citizenship_number === citizenship_number
                            ? "Citizenship number already registered"
                            : "Phone number already registered",
                });
            }

            const [userExistResult] = await pool.execute(
                "SELECT * FROM user_detail WHERE id = ?",
                [user_id]
            );

            if (userExistResult.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot Create Voter Card for unregistered user",
                });
            }

            // Insert new voter card
            const [insertResult] = await pool.execute(
                `INSERT INTO voter_card 
            (citizenship_number, phone_number, citizenship_front_pic, citizenship_back_pic, user_id, verification_status) 
            VALUES (?, ?, ?, ?, ?, 0)`,
                [
                    citizenship_number,
                    phone_number,
                    citizenship_front_pic,
                    citizenship_back_pic,
                    user_id,
                ]
            );

            // Get voter ID
            const [voterResult] = await pool.execute(
                "SELECT voter_id FROM voter_card WHERE citizenship_number = ? AND phone_number = ?",
                [citizenship_number, phone_number]
            );

            return res.status(201).json({
                success: true,
                message: "Voter Card created successfully",
                data: {
                    voter_id: voterResult[0].voter_id,
                    citizenship_number,
                    phone_number,
                    citizenship_front_pic,
                    citizenship_back_pic,
                    verification_status: 0,
                },
            });
        } catch (err) {
            console.error("Server error:", err);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
    }
);

app.put(
    "/voter_card_register",
    uploadCitizenship.fields([
        { name: "citizenship_front_pic", maxCount: 1 },
        { name: "citizenship_back_pic", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { citizenship_number, phone_number, user_id } = req.body;

            if (!citizenship_number || !phone_number || !user_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Validate Nepal phone number
            const nepalPhoneRegex = /^9[7-8][0-9]{8}$/;
            if (!nepalPhoneRegex.test(phone_number)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Nepal phone number format",
                });
            }

            // Ensure images were uploaded
            if (
                !req.files ||
                !req.files.citizenship_front_pic ||
                !req.files.citizenship_back_pic
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Both citizenship front and back images are required",
                });
            }

            const citizenship_front_pic =
                req.files.citizenship_front_pic[0].path;
            const citizenship_back_pic = req.files.citizenship_back_pic[0].path;

            // Check if voter card exists for the user
            const [existingCard] = await pool.execute(
                "SELECT * FROM voter_card WHERE user_id = ?",
                [user_id]
            );

            if (existingCard.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No voter card found for this user",
                });
            }

            // Update voter card
            await pool.execute(
                `UPDATE voter_card 
                SET citizenship_number = ?,
                    phone_number = ?,
                    citizenship_front_pic = ?,
                    citizenship_back_pic = ?,
                    verification_status = 0
                WHERE user_id = ?`,
                [
                    citizenship_number,
                    phone_number,
                    citizenship_front_pic,
                    citizenship_back_pic,
                    user_id,
                ]
            );

            // Get updated voter card details
            const [updatedCard] = await pool.execute(
                "SELECT * FROM voter_card WHERE user_id = ?",
                [user_id]
            );

            return res.status(200).json({
                success: true,
                message: "Voter Card updated successfully",
                data: {
                    voter_id: updatedCard[0].voter_id,
                    citizenship_number,
                    phone_number,
                    citizenship_front_pic,
                    citizenship_back_pic,
                    verification_status: 0,
                },
            });
        } catch (err) {
            console.error("Server error:", err);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
    }
);

app.post("/voter_id_retrieve", async (req, res) => {
    try {
        const { user_id } = req.body;
        const sql =
            "SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name, u.photo_url, v.voter_id, v.citizenship_number, v.phone_number, v.verification_status FROM user_detail AS u JOIN voter_card AS v ON u.id = v.user_id WHERE v.user_id = ? GROUP BY v.user_id;";

        const [result] = await pool.execute(sql, [user_id]);

        if (result.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Voter ID hasn't been applied yet.",
                status: "unapplied",
            });
        }

        if (result[0].verification_status == 0) {
            return res.status(200).json({
                success: false,
                message: "Voter ID hasn't been verified yet.",
                status: "pending",
            });
        }

        if (result[0].verification_status == 2) {
            return res.status(200).json({
                success: false,
                message: "Invalid Documents.",
                status: "rejected",
            });
        }
        if (result[0].verification_status == 1) {
            return res.status(200).json({
                success: true,
                message: "Voter found",
                voter_id: result[0].voter_id,
                status: "verified",
                data: {
                    voter_id: result[0].voter_id,
                    full_name: result[0].full_name,
                    photo_url: result[0].photo_url,
                    citizenship_number: result[0].citizenship_number,
                    phone_number: result[0].phone_number,
                },
            });
        }
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message,
        });
    }
});

app.post("/admin_login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === "" || password === "") {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            return res.status(200).json({
                success: true,
                message: "Login successful",
                admin_id: process.env.ADMIN_ID,
            });
        }

        // Invalid credentials
        return res.status(200).json({
            success: false,
            message: "Invalid email or password",
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

app.get("/unverified_voter_list", async (req, res) => {
    try {
        const sql =
            "SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name, u.id, u.dob, v.citizenship_number, v.phone_number, v.citizenship_front_pic, v.citizenship_back_pic FROM user_detail AS u JOIN voter_card AS v ON u.id = v.user_id WHERE v.verification_status = 0 GROUP BY v.user_id;";

        const [result] = await pool.execute(sql);

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All applied users are verified",
            });
        }

        return res.status(200).json({
            success: true,
            message: "List of unverified users",
            data: result,
        });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message,
        });
    }
});

app.post("/verify_voter", async (req, res) => {
    try {
        const { user_id } = req.body;

        if (user_id === "") {
            return res.status(400).json({
                success: false,
                message: "Missing user Id field",
            });
        }
        const checkUserSql = `SELECT verification_status FROM voter_card WHERE user_id = ?`;
        const [checkUserResult] = await pool.execute(checkUserSql, [user_id]);
        if (checkUserResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "User hasn't applied for voter Id",
            });
        }

        if (checkUserResult[0].verification_status === 1) {
            return res.status(200).json({
                success: false,
                message: "User is already verified",
            });
        }
        const verifyUserSql = `UPDATE voter_card SET verification_status = 1 WHERE user_id = ?`;

        await pool.execute(verifyUserSql, [user_id]);

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message,
        });
    }
});

app.post("/reject_voter", async (req, res) => {
    try {
        const { user_id } = req.body;

        if (user_id === "") {
            return res.status(400).json({
                success: false,
                message: "Missing user Id field",
            });
        }
        const checkUserSql = `SELECT verification_status FROM voter_card WHERE user_id = ?`;
        const [checkUserResult] = await pool.execute(checkUserSql, [user_id]);
        if (checkUserResult.length === 0) {
            return res.status(200).json({
                success: false,
                message: "User hasn't applied for voter Id",
            });
        }

        if (checkUserResult[0].verification_status === 2) {
            return res.status(200).json({
                success: false,
                message: "User is already rejected",
            });
        }
        const rejectUserSql = `UPDATE voter_card SET verification_status = 2 WHERE user_id = ?`;

        await pool.execute(rejectUserSql, [user_id]);

        return res.status(200).json({
            success: true,
            message: "User rejected successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message,
        });
    }
});
