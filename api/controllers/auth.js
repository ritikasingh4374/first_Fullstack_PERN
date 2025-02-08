import bcrypt from "bcryptjs";
import db from "../connect.js"; // ✅ Ensure this file correctly exports the database connection
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE username = $1";  // ✅ PostgreSQL uses $1 instead of ?
    
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.rows.length > 0) return res.status(400).json({ error: "Username already exists" });

        // ✅ Hash password inside the callback
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q2 = "INSERT INTO users (username, email, password, name) VALUES ($1, $2, $3, $4)";
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name
        ];

        db.query(q2, values, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
        });
    });
};

export const login = (req, res) => {
        const q = "SELECT * FROM users WHERE username = $1";

        db.query(q, [req.body.username], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.rows.length === 0) return res.status(401).json({ error: "Invalid username or password" });

        const validPassword = bcrypt.compareSync(req.body.password, data.rows[0].password);
            if (!validPassword) return res.status(401).json({ error: "Invalid username or password" });
        const token = jwt.sign({id : data.rows[0].id}, "securitykey");

        const {password, ...others} = data.rows[0];

        res.cookie("accesToken", token, {
            httpOnly : true,
        }).status(200).json(others);
    });
};
export const logout = (req, res) => {
    res.clearCookie("accesToken", {
        secure : true,
        sameSite : "none"
    }).status(200).json("user has been logged out");
};
