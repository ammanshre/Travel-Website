function sellerOnly(req, res, next) {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: "Access denied. Only sellers are allowed to perform this action." });
    }
    next();
}
module.exports = sellerOnly;
