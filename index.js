const express = require('express')
const app = express()
const main = require('./routes/main')
const cart = require('./routes/cart')
const user = require('./routes/user')
const products = require('./routes/products')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const initializePassport = require('./passport-config')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('express-flash')
const getData = require('./modules/get_data')
require('dotenv').config()

// --- METHOD OVERRIDE --- 
app.use(methodOverride('_method'))

// --- PASSPORT ---
initializePassport(passport, async email => {
    await getData('SELECT email FROM customers WHERE email = ?', email) 
}, async id => {
    await getData('SELECT id FROM customers WHERE id = ?', id)
})

// --- SESSIONS ---
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// --- BODY PARSER ---
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// --- VIEW ENGINE CONFIG ---
app.use('/stylesheet', express.static(__dirname + '/views/stylesheet'))
app.use('/images', express.static(__dirname + '/views/images'))
app.use('/js', express.static(__dirname + '/views/js'))
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views/'))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// --- ROUTER ---
app.use('/', main)
app.use('/cart', cart)
app.use('/products', products)
app.use('/user', user)
// 404
app.use(function(req, res, next) {
    res.status(404).render('404')
})

app.listen(5050, function(){
    console.log('Server started')
});