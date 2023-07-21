import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const bearer = req.headers.authorization?.split(" ")[1];
    if (bearer === undefined)
        res.send({ "error": "invalid token or auth header is not present" })
    else
        jwt.verify(bearer, "secretkey", (err, payload) => {
            if (err)
                res.status(403).send(err)
            else {
                req.payload = payload;
                return next();
            }
        })
}