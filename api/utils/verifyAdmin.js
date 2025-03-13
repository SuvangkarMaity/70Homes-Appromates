export const verifyAdmin = (req, res, next) => {
    if (req.user.user_type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access only!' });
    }
    next();
};