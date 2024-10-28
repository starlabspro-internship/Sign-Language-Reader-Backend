import cloudinary from 'cloudinary';
import fs from 'fs';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../configuration.js';
import Sign from '../models/Sign.model.schema.js';

cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

// create sign

export const createSign = async (req, res) => {
    try {
        const { name } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ message: "No image file uploaded." });
        }

        const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path, {
            folder: 'sign_images'
        });

        fs.unlink(imageFile.path, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        const sign = new Sign({
            name,
            signImage: uploadResult.secure_url
        });
        await sign.save();

        res.status(201).json(sign);
    } catch (error) {
        console.error("Error creating sign:", error);
        res.status(500).json({ message: 'Error creating sign', error: error.message });
    }
};

// getSigns

export const getSigns = async (req, res) => {
    try {
        const signs = await Sign.find();
        res.status(200).json(signs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching signs', error: error.message });
    }
};

// update sign

export const updateSign = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const imageFile = req.file;

        const sign = await Sign.findById(id);
        if (!sign) {
            return res.status(404).json({ message: "Sign not found" });
        }
        if (name) sign.name = name;

        if (imageFile) {
            const publicId = sign.signImage.split('/').pop().split('.')[0];
            await cloudinary.v2.uploader.destroy(`sign_images/${publicId}`);

            const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path, {
                folder: 'sign_images'
            });
            sign.signImage = uploadResult.secure_url;

            fs.unlink(imageFile.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        await sign.save();

        res.status(200).json(sign);
    } catch (error) {
        console.error("Error updating sign:", error);
        res.status(500).json({ message: 'Error updating sign', error: error.message });
    }
};

// Delete sing
export const deleteSign = async (req, res) => {
    try {
        const { id } = req.params;

        const sign = await Sign.findByIdAndDelete(id);
        if (!sign) return res.status(404).json({ message: 'Sign not found' });

        res.status(200).json({ message: 'Sign deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sign', error: error.message });
    }
};

export const translateSigns = async (req, res) => {
    const { phrase } = req.query;
    const words = phrase.trim().split(/\s+/);

    const translation = [];

    for (const word of words) {
        const sign = await Sign.findOne({ name: word.toLowerCase() });
        if (sign) {
            translation.push({ word, image: sign.signImage });
        } else {
            translation.push({ word, error: "unsupported word" });
        }
    }

    res.json({ translation });
};

