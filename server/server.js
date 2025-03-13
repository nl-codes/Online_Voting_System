const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

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

app.post("/user_register", (req, res) => {
    let sql =
        "INSERT INTO `user_details`(`first_name`, `last_name`, `email`, `pass_word`, `dob`, `photo_url`) VALUES (?,?,?,?,?,?);";
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.pass_word,
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
});
