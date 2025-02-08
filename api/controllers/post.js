import db from "../connect.js"
export const getPosts = (req, rest) =>{
    const q = `SELECT p.*, u.id as userId, name, profilepic from posts as p join users as u on user.id = p.userId`

    db.query(q, (err,data) => {
        if(err) return rest.status(500).json(err);
        return rest.status(200).json(data);
    })
}

export default getPosts