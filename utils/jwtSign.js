import jwt from "jsonwebtoken"
export default (payload) => jwt.sign(payload, "secretkey", { expiresIn: "1h"})