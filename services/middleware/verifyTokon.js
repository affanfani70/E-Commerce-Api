const jwt = require("jsonwebtoken");

const verifyTokon = (req, res, next) => {
    const authHeader = req.headers.tokon;
    if (authHeader) {
        const tokon = authHeader.split(" ")[1];
        jwt.verify(tokon, "Fani11220", (err, user) => {
            if (err) {
                res.status(403).json({ message: "session is expired" });
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401).json({ message: "You are not authenticated" })
    }
}

const verifyTokonAndAuthriztion = (req, res, next) => {
    verifyTokon(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({ message: "You are not allow to do that" })
        }
    })
}
const verifyTokonAndAdmin = (req, res, next) => {
    verifyTokon(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({ message: "You are not allow to do that" })
        }
    })
}

module.exports = { verifyTokon, verifyTokonAndAuthriztion, verifyTokonAndAdmin }