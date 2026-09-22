const pool = require('../config/database')

const getAdmin = async ()=>{
    const result =await pool.query(
        "SELECT COUNT(*) FROM admins"
        );
    return parseInt(result.rows[0].count, 10);

};
const verifyAdmin = async (telephone) => {
    const result = await pool.query(
        "SELECT * FROM admins WHERE telephone = $1",
        [telephone]
    );
    return result.rows[0];

};

const createAdmin = async(phone,password)=>{
        const bcrypt = require("bcrypt");
        const passwordHash = await bcrypt.hash(password, 10)
            const result = await pool.query(
                `INSERT INTO admins (telephone, password_hash, role)
                    VALUES ($1, $2, $3)`,
                    [phone, passwordHash, "admin" ]
    );
    return result.rows[0]
}



module.exports = {getAdmin,createAdmin,verifyAdmin};