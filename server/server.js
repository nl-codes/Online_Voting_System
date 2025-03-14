const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

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

// Register user
app.post("/user_register", async (req, res) => {
    let sql =
        "INSERT INTO `user_details`(`first_name`, `last_name`, `email`, `pass_word`, `dob`, `photo_url`) VALUES (?,?,?,?,?,?)";

    try {
        const hashedPassword = await bcrypt.hash(req.body.pass_word, 10);

        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashedPassword,
            req.body.dob,
            req.body.photo_url,
        ];

        db.query(sql, values, (err, result) => {
            if (err)
                return res.json({
                    message: "Something unexpected has occured : " + err,
                });
            return res.json({ success: "User registered successfully" });
        });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
});

// Login user
app.post("/user_login", (req, res) => {
    let sql = "SELECT * FROM `user_details` WHERE `email` = ?;";
    const { email, pass_word } = req.body;

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

        const isMatch = await bcrypt.compare(pass_word, user.pass_word);
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
    let sql = "SELECT * FROM `user_details` WHERE `email` = ?;";
    db.query(sql, [req.params.email], (err, result) => {
        if (err)
            return res.json({
                message: "Something unexpected has occured : " + err,
            });
        return res.json({ exists: result.length > 0 });
    });
});

// app.get("/test", (req, res) => {
//     res.json({
//         message: "This text was sent to arjabi from backend :)🫡",
//     });
// });

// const ngrok = require("@ngrok/ngrok");
// ngrok.authtoken("2uIGXWnEP5mrzcarCriXggtwq11_5fee6TTDFD5SrvBWMFmb1");
// // Start ngrok and tunnel your server
// ngrok
//     .connect({ addr: port, subdomain: "mycustomsubdomain" })
//     .then((listener) => {
//         console.log(`Ingress established at: ${listener.url()}`);
//     });
