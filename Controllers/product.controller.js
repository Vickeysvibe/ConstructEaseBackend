import Products from "../Models/Products.model.js"

export const createProduct = async (req, res) => {
    try {
        const { name, description, category, unit } = req.body;
        const { siteId } = req.query;
        const newProduct = new Products({ name, description, category, unit, siteId });
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            redirectUrl: 'http://.....'
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updatedData = req.body;
        const { siteId } = req.query;
        updatedData.siteId = siteId;
        const updatedProduct = await Products.findByIdAndUpdate(productId, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            redirectUrl: 'http://.....'
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const { siteId } = req.query;
        let products;

        if (siteId) {
            products = await Products.find({ siteId }).populate("siteId", "name");
        } else {
            products = await Products.find().populate("siteId", "name");
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            redirectUrl: 'http://.....'
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Products.findById(productId).populate("siteId", "name");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            redirectUrl: 'http://.....'
        });
    }
};

export const uploadExcel = async (req, res) => {
    try {
        const { siteId } = req.query;

        if (!siteId) {
            return res.status(400).json({ error: "Site ID is required in the query" });
        }
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.file;
        const workbook = XLSX.read(file.data, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const products = [];

        jsonData.forEach((row) => {
            const { name, description, category, unit } = row;
            if (name && description && category && unit) {
                products.push({ name, description, category, unit, siteId });
            }
        });

        if (products.length === 0) {
            return res.status(400).json({ error: "No valid data found in the file" });
        }

        await Products.insertMany(products);
        res.status(200).json({ message: "Products uploaded successfully", products });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            redirectUrl: 'http://.....'
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const deletedProduct = await Products.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message, redirectUrl: 'http://.....' });
    }
};
