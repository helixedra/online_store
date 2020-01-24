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

    console.log(req.body);
    
    // if(req.body)
    // let search = await getData('SELECT * FROM `products` WHERE title LIKE '%ком%' OR description LIKE '%ком%' OR id LIKE '%ком%'')
})

module.exports = router