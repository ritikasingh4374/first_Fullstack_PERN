import db from "../connect.js"
import jwt from "jsonwebtoken";
import moment from "moment";


export const getPosts = (req, res) => {
    const token = req.cookies.accesToken;  // Fix key name if incorrect
    if (!token) {
        console.error(" No token provided");
        return res.status(401).json({ error: "You must be logged in to access this resource" });
    }

    jwt.verify(token, "securitykey", (err, user) => {

        const q = `
            SELECT p.*, u.id AS userId, u.name, u.profilepic 
            FROM posts AS p
            JOIN users AS u ON u.id = p.userid
            LEFT JOIN relationships AS r ON p.userid = r.followedid 
            WHERE r.followerid = $1
        `;

        db.query(q, [user.id], (err, data) => {
            if (err) {
                console.error("❌ Database query error:", err.message);
                return res.status(500).json({ error: err.message });
            }

            console.log("✅ Query successful. Number of posts:", data.rows.length);
            return res.status(200).json(data.rows);
        });
    });
};


export const addPost = (req, res) => {
    const token = req.cookies.accesToken;  
    if (!token) {
        console.error("❌ No token provided");
        return res.status(401).json({ error: "You must be logged in to access this resource" });
    }

    jwt.verify(token, "securitykey", (err, user) => {
        if (err) return res.status(401).json({ error: "Token is invalid" });

        console.log(`🔹 User verified. ID: ${user.id}`);

        const q = 
            `INSERT INTO posts ("description", "image", "userid") VALUES ($1, $2, $3) RETURNING *`;

        const values = [
            req.body.desc,  // Description
            req.body.img,   // Image URL or null
            user.id         // User ID
        ];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("❌ Database query error:", err.message);
                return res.status(500).json({ error: err.message });
            }

            console.log("✅ Post added successfully:", data.rows[0]);
            return res.status(200).json(data.rows[0]);
        });
    });
};
