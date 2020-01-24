const express = require('express')
const router = express.Router()
const getData = require('../modules/get_data')


// SUPPORT FUNCTIONS
function toArray(str) {
    if (str !== '') {
        return str.replace(' ', '').split(',')
    } else {
        return false
    }
}

//------------------------------
// ***** ROUTER /products/ *****
//------------------------------

// CATEGORY
router.get('/c/:ref', async function (req, res) {

    let getAllCategories = await getData('SELECT * FROM categories', false)

    let categoryData = getAllCategories.filter(category => category.ref === req.params.ref)

    if (categoryData) {

        if (req.query.sort === undefined || req.query.sort === 'rating') {

            req.query.sort = 'rating'

            let productsData = await getData('SELECT * FROM products WHERE category = ? AND primary_item = 1  ORDER BY ?? ASC', [categoryData[0].id, req.query.sort]);

            res.render('category', {
                title: categoryData[0].title,
                categories: getAllCategories,
                category: categoryData[0],
                // slider: sliderData,
                products: productsData,
                sort: 'По популярности'
            })

        } else if (req.query.sort === 'priceup') {

            let productsData = await getData('SELECT * FROM products WHERE category = ? AND primary_item = 1 ORDER BY price ASC', categoryData[0].id);

            res.render('category', {
                title: categoryData[0].title,
                categories: getAllCategories,
                category: categoryData[0],
                // slider: sliderData,
                products: productsData,
                sort: 'От дешевых к дорогим'
            })

        } else if (req.query.sort === 'pricedown') {

            let productsData = await getData('SELECT * FROM products WHERE category = ? AND primary_item = 1  ORDER BY price DESC', categoryData[0].id);

            res.render('category', {
                title: categoryData[0].title,
                categories: getAllCategories,
                category: categoryData[0],
                // slider: sliderData,
                products: productsData,
                sort: 'От дорогих к дешевым'
            })

        } else {
            res.status(404).render('404')
        }

    } else {
        res.status(404).render('404')
    }
})

// PRODUCT PAGE
router.get('/p/:id', async function (req, res) {

    if (req.params.id && req.query.color && req.query.size) {

        // Get product data from DB by id and options
        let productData = await getData('SELECT * FROM products JOIN sizes ON products.size = sizes.size_id WHERE products.id = ? AND products.color = ? AND products.size = ?', [req.params.id, req.query.color, req.query.size])

        // Get all catagories data from DB
        let getAllCategories = await getData('SELECT * FROM categories', false)

        // Select data for specific category
        let categoryData = getAllCategories.filter(category => category.id === productData[0].category)

        // Get data from DB of all possible color available for selected product
        let productColorOptions = await getData('SELECT products.id, products.color, products.product_group, products.ref, products.size, colors.color_id, colors.color_name, colors.color_hex FROM products JOIN colors ON products.color = colors.color_id WHERE products.product_group = ?', productData[0].product_group)

        // Get array of colors id available for this product in group
        let availableColorsAll = productColorOptions.map(item => item.color)

        // Filter colors id (removing duplicates)
        let availableColors = availableColorsAll.filter((item, index) => availableColorsAll.indexOf(item) === index)
        
        // Create new array with data to provide as product color options in template
        let colorOptions = availableColors.map(id => productColorOptions.find(item => item.color === id))

        // Get data from DB for all available size options for selected product
        let sizeOptions = await getData('SELECT products.id, products.ref, products.color, products.size, products.product_group, sizes.size_id, sizes.size_name FROM products JOIN sizes ON products.size = sizes.size_id WHERE products.color = ? AND products.product_group = ?', [req.query.color, productData[0].product_group])

        // Get data from DB for related products
        let relatedProducts = await getData('SELECT * FROM products WHERE products.category = ? AND top = 1 AND primary_item = 1 ORDER BY rating DESC LIMIT 0,4', productData[0].category)

        // Render template if fetching product data was successful
        if (productData.length > 0) {
            res.render('product', {
                title: productData[0].title,
                product: productData[0],
                categories: getAllCategories,
                category: categoryData[0],
                colors: colorOptions,
                sizes: sizeOptions,
                thumbs: toArray(productData[0].images),
                relatedProducts: relatedProducts
            })
        } else {
            res.status(404).render('404')
        }
    // Render 404 if query string parameters missing
    } else {
        res.status(404).render('404')
    }

})

module.exports = router