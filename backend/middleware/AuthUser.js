import User from '../models/UserModel.js';

export const verifyUser = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "First login to your account" })
        }

        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found!" })
        }

        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found!" })
        }

        if (user.role !== "admin") {
            return res.status(403).json({ msg: "Access Forbidden!" })
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}