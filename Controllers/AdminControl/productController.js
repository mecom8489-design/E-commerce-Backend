const Product = require('../../models/AdminModel/productModel');
const fs = require('fs');

const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  if (typeof imagePath !== 'string') imagePath = String(imagePath);
  return `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;
};


exports.createProduct = async (req, res) => {
  try {
    const { name, price, rating, discount, description, category, stock } = req.body;
    const image = req.file ? req.file.path : null;

    const result = await Product.create({ name, price, rating, discount, description, category, stock, image });
    return res.status(201).json({ message: 'Product created', productId: result.insertId, image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    const productsWithUrl = products.map(p => ({ ...p, image: getFullImageUrl(req, p.image) }));
    return res.status(200).json(productsWithUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.image = getFullImageUrl(req, product.image);
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, rating, discount, description, category, stock } = req.body;
    const newImage = req.file ? req.file.path : null;

    const existingProduct = await Product.getById(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    // Delete old image if replaced
    if (newImage && existingProduct.image) fs.unlink(existingProduct.image, () => {});

    const image = newImage || existingProduct.image;
    await Product.update(id, { name, price, rating, discount, description, category, stock, image });

    return res.status(200).json({ message: 'Product updated successfully', image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.getById(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    if (existingProduct.image) fs.unlink(existingProduct.image, () => {});
    await Product.delete(id);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
