import User from '../models/UserModel.js';
import argon2 from 'argon2';

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Login failed!" })
        }

        const match = await argon2.verify(user.password, req.body.password);

        if (!match) {
            return res.status(400).json({ msg: "Login failed!" })
        }

        req.session.userId = user.uuid;

        const uuid = user.uuid,
            name = user.name,
            email = user.email,
            role = user.role;
        res.status(200).json({ uuid, name, email, role });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const Me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "First login to your account" })
        }

        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found!" })
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const LogOut = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(400).json({ msg: "Logout failed" })
            }

            res.status(200).json({ msg: "Logout success" })
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}