const Product = require('../../models/AdminModel/productModel');
const fs = require('fs');

const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;

  imagePath = imagePath.trim().replace(/^\/+/, "");

  // If Cloudinary or any full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Local uploads
  return `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;
};


exports.createProduct = async (req, res) => {
  try {
    const { name, price, rating, discount, description, category, stock, offer } = req.body;
    const image = req.file ? req.file.path : null;

    const result = await Product.create({ name, price, rating, discount, description, category, stock, image, offer });
    return res.status(201).json({ message: 'Product created', productId: result.insertId, image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllWithOrderCount();

    const productAd = [];
    const bestSeller = [];
    const recommended = [];
    const viewMore = [];

    products.forEach(p => {
      p.image = getFullImageUrl(req, p.image);

      const offerText = p.offer ? p.offer.toLowerCase() : "";
      const offerList = offerText.split(",").map(v => v.trim());

      if (offerList.includes("productad")) {
        productAd.push(p);
      }

      if (offerList.includes("bestseller")) {
        bestSeller.push(p);
      }

      if (offerList.includes("recommended")) {
        recommended.push(p);
      }

      if (!offerText) {
        viewMore.push(p);
      }
    });

    return res.status(200).json({
      data: {
        productAd,
        bestSeller,
        recommended,
        viewMore
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    const { name, price, rating, discount, description, category, stock, offer } = req.body;
    const newImage = req.file ? req.file.path : null;

    const existingProduct = await Product.getById(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    // Delete old image if replaced
    if (newImage && existingProduct.image) fs.unlink(existingProduct.image, () => {});

    const image = newImage || existingProduct.image;
    await Product.update(id, { name, price, rating, discount, description, category, stock, image, offer });

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
