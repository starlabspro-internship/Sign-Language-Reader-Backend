export default (req, res, next) => {
    const file = req.file;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Invalid file format. Only JPEG, PNG, and GIF files are allowed." });
      }
    }
    next();
};
  