const express = require('express')
const router = express.Router()
const connection = require('../modules/db_connect')
const mailer = require('../modules/mailer')

router.post('/getcart', function (req, res) {

    let ids = Object.values(req.body).toString()

    if (ids) {
        connection.query('SELECT id, uri, cover_img, title, code, price FROM products WHERE id IN (' + ids + ') ORDER BY FIND_IN_SET(id,"' + ids + '")', function (err, result) {
            if (err) throw err
            if (result === undefined) {
                res.send()
            } else {
                res.send(result)
            }
        })

    } else {
        res.send('ERROR')
    }

})

/* CHECKOUT ROUTER */

router.get('/checkout', function (req, res) {

    res.render('checkout', {
        title: 'Оформление заказа',
        cart: ''
    })
})

/* CHECKOUT POST */

router.post('/checkout', function (req, res) {


    if (req.body) {
        connection.query('INSERT INTO orders (id, client_name, client_phone, client_email, client_id, delivery_option, payment_option, delivery_address, np_address, order_items, total, order_status) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.body.name, req.body.phone, req.body.email, req.body.client_id, req.body.delivery_option, req.body.payment_option, req.body.delivery_address, req.body.np_address, req.body.order, req.body.total, "new"], async function (err, result) {
            if (err) throw err

            // console.log(result)
            // console.log(result.insertId)

            if (result) {


                // send mail with options
                let mail = {
                    from: '"Lansot" <sales@lansot.com>',
                    to: req.body.email,
                    subject: 'Ваша заказ №' + result.insertId + ' принят',
                    template: 'checkout_client_email',
                    context: {
                        client_name: req.body.name,
                        order_id: result.insertId
                    }
                }

                let info = await mailer.sendMail(mail);

                // console.log("Message sent: %s", info.messageId);


                //Render success template
                res.render('checkout_success', {
                    message: 'Ваш заказ принят',
                    order_id: result.insertId,
                    success: true

                })

            } else {
                res.send(err)
            }
        })
    }






    // res.render('checkout', {
    //     title: 'Оформление заказа',
    //     cart: ''
    // })
})

module.exports = router