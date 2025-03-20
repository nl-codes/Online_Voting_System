import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import upload from "./middleware/multerConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "online_voting_system",
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// app.use("/api", uploadRoutes); // Add upload route

// Register user
app.post("/user_register", async (req, res) => {
    let sql =
        "INSERT INTO `user_detail`(`first_name`, `last_name`, `email`, `password_hash`, `dob`, `photo_url`) VALUES (?,?,?,?,?,?)";

    try {
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        console.log(hashedPassword);

        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashedPassword,
            req.body.dob,
            req.body.photo_url,
        ];
        console.log(values);

        db.query(sql, values, (err, result) => {
            if (err)
                return res.json({
                    message: "Something unexpected has occured : " + err,
                });
            return res.json({ success: "User registered successfully" });
        });
    } catch (err) {
        return res.status(500).json({ error: "This Server error" + err });
    }
});

// Login user
app.post("/user_login", (req, res) => {
    let sql = "SELECT * FROM `user_detail` WHERE `email` = ?;";
    const { email, password } = req.body;

    db.query(sql, [email], async (err, result) => {
        if (err)
            return res
                .status(500)
                .json({ error: "Database error : " + err, success: false });

        if (result.length === 0) {
            return res
                .status(401)
                .json({ error: "Invalid email or password", success: false });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: "Invalid email or password", success: false });
        }

        // Send user data except password
        return res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            dob: user.dob,
            photo_url: user.photo_url,
            success: true,
        });
    });
});

app.get("/user_exists/:email", (req, res) => {
    let sql = "SELECT * FROM `user_detail` WHERE `email` = ?;";
    db.query(sql, [req.params.email], (err, result) => {
        if (err)
            return res.status(500).json({
                error: "Something unexpected has occured : " + err,
            });
        return res.json({ exists: result.length > 0 });
    });
});

app.post("/upload_picture", upload.single("image"), (req, res) => {
    try {
        // Log the entire request for debugging
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        console.log("File:", req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // If file upload was successful
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            path: req.file.path,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: error.message,
        });
    }
});

// Register Candidate
app.post("/candidate_register", upload.single("image"), (req, res) => {
    try {
        const { full_name, saying } = req.body;

        // Debug logs
        console.log("Request body:", JSON.stringify(req.body));
        console.log("File:", JSON.stringify(req.file));

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
            "INSERT INTO `candidate`(`full_name`, `saying`, `photo_url`) VALUES (?,?,?)";
        const values = [full_name, saying, photo_url];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message,
                });
            }

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

app.post("/election_register", (req, res) => {
    try {
        const { topic, description, position, start_time, stop_time } =
            req.body;

        console.log(req.body);
        if (!topic || !description || !position || !start_time || !stop_time) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const sql =
            "INSERT INTO `election`(`topic`, `description`, `position`, `start_time`, `stop_time`) VALUES (?,?,?,?,?)";
        const values = [topic, description, position, start_time, stop_time];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message,
                });
            }

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
        });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: "Unknown error:  " + err.message,
        });
    }
});

app.post("/assign_candidate", (req, res) => {
    const { election_id, candidate_id } = req.body;

    if (!election_id || !candidate_id) {
        return res.status(400).json({
            success: false,
            message: "Election ID and Candidate ID are required",
        });
    }

    const sql =
        "INSERT INTO `election_candidate` (`election_id`, `candidate_id`, `votes`) VALUES (?, ?, 0);";

    const values = [election_id, candidate_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error assigning candidate:", err);
            return res
                .status(500)
                .json({ message: "Error assigning candidate" });
        }
        res.json({ success: true, message: "Candidate assigned successfully" });
    });
});

app.post("/vote", (req, res) => {
    const { election_id, candidate_id, user_id } = req.body;

    if (!election_id || !candidate_id || !user_id) {
        return res.status(400).json({
            success: false,
            message: "Election ID, Candidate ID and User ID are required",
        });
    }

    // First check if user has already voted
    let sql = "SELECT * FROM votes WHERE user_id = ? AND election_id = ?;";

    db.query(sql, [user_id, election_id], (err, result) => {
        if (err) {
            console.error("Error checking vote:", err);
            return res.status(500).json({ message: "Error voting" });
        }

        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User has already voted in this election",
            });
        }

        // If user hasn't voted, proceed with inserting the vote
        const insertSql =
            "INSERT INTO votes (election_id, candidate_id, user_id) VALUES (?, ?, ?);";
        const values = [election_id, candidate_id, user_id];

        db.query(insertSql, values, (err, result) => {
            if (err) {
                console.error("Error voting:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error voting",
                });
            }
            res.json({
                success: true,
                message: "Vote cast successfully",
            });
        });
    });
});
