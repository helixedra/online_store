const express = require('express')
const router = express.Router()
const getData = require('../modules/get_data')
require('datejs')

async function menuCategories(){
    return await getData('SELECT * FROM categories', false)
}

// define the home page route
router.get('/', async function (req, res) {

       let sliderData = await getData('SELECT * FROM slider WHERE visible = 1', false);
       let productsData = await getData('SELECT * FROM products WHERE top = 1 AND primary_item = 1', false);
       let news = await getData('SELECT * FROM news ORDER BY date DESC LIMIT 0,4') 

       news.forEach(item => {
           item.date = Date.parse(item.date).toString('d.MM.yyyy')  
       })

        res.render('home', {
            title: 'Homepage',
            categories: await menuCategories(),
            slider: sliderData,
            products: productsData,
            news: news
        })
  
})


router.post('/search', async function(req, res){

    let result = await getData('SELECT id, uri, ref, title, color, size, cover_img FROM products WHERE title LIKE ? OR description LIKE ? OR id LIKE ?', ['%'+req.body.search+'%', '%'+req.body.search+'%', '%'+req.body.search+'%'])
    res.send(result)

})


router.get('/news', async function (req, res){

    let news = await getData('SELECT * FROM news ORDER BY date DESC') 

    news.forEach(item => {
        item.date = Date.parse(item.date).toString('d.MM.yyyy')  
    })

    res.render('news', {
        title: 'Новости',
        categories: await menuCategories(),
        news: news
    })
})

router.get('/delivery', async function (req, res){

    res.render('delivery', {
        title: 'Оплата и доставка',
        categories: await menuCategories(),
    })
})

router.get('/contacts', async function (req, res){

    res.render('contacts', {
        title: 'Контакты',
        categories: await menuCategories(),
    })
})

module.exports = router