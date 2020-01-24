const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const connection = require('../modules/db_connect')


// --- checkAuth ---
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/user/login')
    }
}
// --- checkNotAuth ---
function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
    //   return res.redirect('/user/profile')
        res.send(true)
    }
    next()
  }

// --- INSERT DATA TO DATABASE ---
function insertData(query, params) {
    return new Promise(resolve => {
        connection.query(query, params, function (err) {
            if (err) throw err
            resolve(true)
        });
    })
}

router.get('/registration', checkNotAuth, function (req, res) {
    res.render('registration', {
        title: 'Registration'
    })
})

// router.get('/login', checkNotAuth, function (req, res) {
//     // req.flash('error', error)

//     // let msg = ''

//     // if (req.query.msg === 'success') {
//     //     msg = 'User have been added seccessfully'
//     // } else if (req.query.msg === 'error') {
//     //     msg = 'Something went wrong. Please try again'
//     // } else {
//     //     msg = false
//     // }

//     // res.render('login', {
//     //     title: 'Login',
//     //     msg: msg
//     // })
//     res.send(false)
// })

router.get('/login', 
function(req, res){
    if(req.query.auth == 'status') {
        if (req.isAuthenticated()) {
            res.send(true)
        } else {
            res.send(false)
        }
    } else {
        res.status(404).send('404 NOT FOUND')
    }

})

router.get('/profile', checkAuth, function (req, res) {
    res.render('profile', {
        title: 'User Profile'
    })
})

router.post('/registration', async function (req, res) {

    try {
        const hashPass = await bcrypt.hash(req.body.password, 10)
        const insertUser = await insertData("INSERT INTO customers (name, email, password, status) VALUES (?, ?, ?, 'active')", [req.body.name, req.body.email, hashPass])

        if (insertUser) {
            // res.send('User added')
            // return done(null, false, { message: 'User have been added seccessfully'})
            res.redirect('/user/login?msg=success')
        } else {
            // return done(null, false, { message: 'Something went wrong. Please try again'})
            res.redirect('/user/login?msg=error')
            // res.send('Something went wrong')
        }
        // res.send(`register...<br>${req.body.name}<br>${req.body.email}<br>${req.body.password}<br>PASSHASH: ${hashPass}`)


        // res.redirect('/user/login') // redirect to login when success

    } catch (error) {

        res.send(error)

        // doing something when failure

    }
    
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    successFlash: true,
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

// router.post('/login', function (req, res) {
//     res.send('login...')
// })

module.exports = router