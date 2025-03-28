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

// Register user
app.post("/user_register", async (req, res) => {
    const sql =
        "INSERT INTO user_detail (first_name, last_name, email, password_hash, dob) VALUES (?,?,?,?,?)";

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashedPassword,
            req.body.dob,
        ];
        console.log(values);
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

// Register Candidate
app.post("/candidate_register", (req, res) => {
    uploadCandidate.single("photo_url")(req, res, async (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({
                success: false,
                message: "File upload failed",
                error:
                    err.code === "LIMIT_FILE_SIZE"
                        ? "File size is too large"
                        : err.code === "LIMIT_UNEXPECTED_FILE"
                        ? "Wrong field name for file upload (expected 'photo_url')"
                        : err.code === "LIMIT_FILE_COUNT"
                        ? "Too many files uploaded"
                        : err.message || "Unknown upload error",
            });
        }

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
    });
});

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

app.get("/view_election_brief", async (req, res) => {
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
        WHERE e.stop_time > NOW() 
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

app.post("/assign_candidate", async (req, res) => {
    const { election_id, candidate_id } = req.body;

    if (!election_id || !candidate_id) {
        return res.status(400).json({
            success: false,
            message: "Election ID and Candidate ID are required",
        });
    }

    try {
        const sql =
            "INSERT INTO `election_candidate` (`election_id`, `candidate_id`, `votes`) VALUES (?, ?, 0)";
        const [result] = await pool.execute(sql, [election_id, candidate_id]);

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

app.get("/voter_id_retrieve", async (req, res) => {
    try {
        const { user_id } = req.body;
        const sql =
            "SELECT voter_id, verification_status FROM voter_card WHERE user_id = ?";

        const [result] = await pool.execute(sql, [user_id]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Voter ID not found",
                status: "Unapplied",
            });
        }

        if (result[0].verification_status != 1) {
            return res.status(401).json({
                success: false,
                message: "Voter ID hasn't been verified yet.",
                status: "Pending",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Voter found",
            voter_id: result[0].voter_id,
            status: "verified",
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
