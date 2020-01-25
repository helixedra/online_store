const express = require('express')
const router = express.Router()
const getData = require('../modules/get_data')

// define the home page route
router.get('/', async function (req, res) {

       let sliderData = await getData('SELECT * FROM slider WHERE visible = 1', false);
       let productsData = await getData('SELECT * FROM products WHERE top = 1 AND primary_item = 1', false);
       let getAllCategories = await getData('SELECT * FROM categories', false)

        res.render('home', {
            title: 'Homepage',
            categories: getAllCategories,
            slider: sliderData,
            products: productsData
        })
  
})

router.post('/search', async function(req, res){

    let result = await getData('SELECT id, uri, ref, title, color, size, cover_img FROM products WHERE title LIKE ? OR description LIKE ? OR id LIKE ?', ['%'+req.body.search+'%', '%'+req.body.search+'%', '%'+req.body.search+'%'])
    res.send(result)

})

module.exports = router