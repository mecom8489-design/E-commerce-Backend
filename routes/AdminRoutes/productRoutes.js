const express = require('express');
const router = express.Router();
const productController = require('../../Controllers/AdminControl/productController');
const upload = require('../../multerConfig');

router.post('/products/add', upload.single('image'), productController.createProduct);
router.get('/products/getall', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/update/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/delete/:id', productController.deleteProduct);

module.exports = router;

