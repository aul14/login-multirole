import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import { Op } from 'sequelize';
import path from 'path'
import fs from 'fs'

export const getProducts = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Product.findAll({
                attributes: ['uuid', 'image', 'url', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        } else {
            response = await Product.findAll({
                attributes: ['uuid', 'image', 'url', 'name', 'price'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if (!product) {
            return res.status(404).json({ msg: "Product is not found!" })
        }

        let response;
        if (req.role === "admin") {
            response = await Product.findOne({
                attributes: ['uuid', 'image', 'url', 'name', 'price'],
                where: {
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        } else {
            response = await Product.findOne({
                attributes: ['uuid', 'image', 'url', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const createProduct = async (req, res) => {
    try {
        if (req.files === null) {
            return res.status(400).json({ msg: "No File Uploaded" })
        }

        const { name, price } = req.body;
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) {
            return res.status(422).json({ msg: "Invalid Images" })
        }
        // Validasi jangan lebih besar dari 5mb
        if (fileSize > 5000000) {
            return res.status(422).json({ msg: "Image must be less than 5 MB" })
        }

        file.mv(`./public/images/${fileName}`, async (err) => {
            if (err) {
                return res.status(500).json({ msg: err.message })
            }

            try {
                await Product.create({
                    image: fileName,
                    url: url,
                    name: name,
                    price: price,
                    userId: req.userId
                })
                res.status(201).json({ msg: "Product created successfully" });
            } catch (error) {
                res.status(500).json({ msg: error.message })
            }
        })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if (!product) {
            return res.status(404).json({ msg: "Product is not found!" })
        }

        let fileName = "";
        if (req.files === null) {
            fileName = product.image;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Invalid Images" })
            }

            if (fileSize > 5000000) {
                return res.status(422).json({ msg: "Image must be less than 5 MB" })
            }

            const filepath = `./public/images/${product.image}`;
            fs.unlinkSync(filepath);

            file.mv(`./public/images/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        }

        const { name, price } = req.body;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        if (req.role === "admin") {
            await Product.update({ name: name, price: price, image: fileName, url: url }, {
                where: {
                    id: product.id
                }
            })
        } else {
            if (req.userId !== product.userId) {
                return res.status(403).json({ msg: "Access Forbidden!" })
            }
            await Product.update({ name, price }, {
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                },
            })
        }
        res.status(200).json({ msg: "Product updated successfully" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if (!product) {
            return res.status(404).json({ msg: "Product is not found!" })
        }

        if (req.role === "admin") {
            const filepath = `./public/images/${product.image}`;
            fs.unlinkSync(filepath);

            await Product.destroy({
                where: {
                    id: product.id
                }
            })
        } else {
            if (req.userId !== product.userId) {
                return res.status(403).json({ msg: "Access Forbidden!" })
            }
            const filepath = `./public/images/${product.image}`;
            fs.unlinkSync(filepath);

            await Product.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                },
            })
        }
        res.status(200).json({ msg: "Product deleted successfully" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}