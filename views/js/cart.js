// **************** CART LOGIC ****************

// GET CART (ITEMS IDs) FROM LOCAL STORAGE

function getCartItemsIdLS() {

    // Check if user logged 
    // ...
    // Get data for specific user 
    // ...

    // Get data for guest

    let cart = JSON.parse(localStorage.getItem('cart-guest'))
    let items = {}

    if (cart !== null) {

        cart.forEach((item, index) => {
            items[index] = item.p
        })

    } else {

        items = false

    }

    return items

    // >>> Return obj with items id or 'false' if cart is empty
}
// *******************************************


// GET QUANTITY BY ID FROM LOCAL STORAGE
function currentItemQty(id) {

    // Check if user logged 
    // ...
    // Get data for specific user 
    // ...

    // Get data for guest

    let cart = JSON.parse(localStorage.getItem('cart-guest'))

    let obj = cart.find(item => {

        if (item.p === id) {
            return item.q
        }

    })

    return obj.q

    // >>> Return QUANTITY for requested ID

}
// *******************************************

// GET AND LOOP ITEMS IN CART
function cartItems(data) {
    // Pass 'data' from DB
    // Loop through 'data' and generate html items for cart
    let output = data.map(value => {
        return `<div class="item d-flex align-items-center justify-content-between" id="item-${value.id}">
                <a href="/products/p/${value.uri}">
                <img src="/images/products/${value.uri}/${value.cover_img}" class="item-img" alt="${value.title}">
                </a>
                <div class="item-info">
                    <div class="item-title">
                        <a href="/products/p/${value.uri}" class="reset-link">${value.title}</a>
                    </div>
                    <div class="item-code">Код товара: <span>${value.id}</span></div>
                </div>
                <div class="item-price">${numFormat(value.price)} ₴</div>
                <div class="item-qty">
                    <button class="reset-btn minusqty" data-item="${value.id}"><i class="far fa-minus"></i></button>
                    <input type="number" data-item="${value.id}" data-price="${value.price}" value="${currentItemQty(value.id)}" class="reset-btn qty">
                    <button class="reset-btn plusqty" data-item="${value.id}"><i class="far fa-plus"></i></button>
                </div>
                <div class="item-sum-price sum-price" data-item="${value.id}">${numFormat(currentItemQty(value.id) * value.price)} ₴</div>
                <button class="item-delete reset-btn" data-item="${value.id}"><i class="far fa-times"></i></button>
            </div>`
    }).join('')
    
    return output
    /* >>> Return html for cart items */
}

// *******************************************

function updateCart() {
    
    let items = getCartItemsIdLS() // get obj with ids only from local storage
    if (items) {
        $('.cart-bottom').removeClass('none')
        getCart(items)
        setCheckmark(items)
    } else {
        $('.cart-empty').show()
        $('.cart-bottom').addClass('none')
        setCheckmark(items)
    }
}




// *** GET DATA FOR ITEMS IN CART FROM DB
function getCart(data) {
    $.ajax({
        url: "/cart/getcart",
        type: "POST",
        dataType: "json",
        data: data,
        success: function (result) {
            let items = $.parseHTML(cartItems(result))
            $('#cart-items').html(items)
        }
    })
}

function setCheckmark(items) {
    if (items) {
        $('.add-to-cart-s').each(function(){
            let id = parseInt($(this).attr('data-id'))
            let item = Object.values(items).indexOf(id)

            if (item !== -1) {
                $(this).addClass('add-checkmark')
            } else {
                $(this).removeClass('add-checkmark')
            }

        })
    } else {
        $('.add-to-cart-s').each(function(){
            $(this).removeClass('add-checkmark')
        })
    }
}

// ******** REMOVE ITEM FROM LOCAL STORAGE BY ID *********
function removeCartItemsLS(id) {
    let cart = getCartLS()
    if (cart) {

        let index = cart.findIndex(item => item.p === parseInt(id))

        if (index >= 0) {
            cart.splice(index, 1)
        }
        if (cart.length === 0) {
            cart = false
        }
    }

    saveCartToLS(cart)
    cartCounter()
    updateCart()
}

// --- SAVE CART TO LOCAL STORAGE ---
function saveCartToLS(data) {

    // If data pass 'false' local storage will be removed

    if (data) {
        // Check if user logged 
        // ...

        // Save cart for guest
        localStorage.setItem('cart-guest', JSON.stringify(data))
    } else {
        // Check if user logged 
        // ...

        // Remove cart for guest
        localStorage.removeItem('cart-guest')
    }

}
// ----------------------------------


// ----- UPDATE QUANTIRY IN LOCAL STORAGE -----

function updateQuantity(id, value) {

    let cart = getCartLS()

    cart.map(item => {
        if (item.p === parseInt(id)) {

            item.q = value
        }
    })

    saveCartToLS(cart)
}

// ----------------------------------------


// --- GET DATA FROM LOCAL STORAGE ---

function getCartLS() {

    let cart = {}

    // Registred user storage
    // ...

    // Guest user storage
    cart = JSON.parse(localStorage.getItem('cart-guest'))

    // Check in its not empty
    if (cart === undefined || cart === null || cart === '') {
        cart = false
    }

    // >>> Return data from local storage

    return cart
}

// -----------------------------------

// ------- GET TOTAL PRICE -------
function total() {
    let total = 0
    $('.qty').each(function () {
        total += parseInt($(this).attr('data-price')) * parseInt($(this).val())
    })
    $('#total').html(numFormat(total) + " ₴")
}
// ----

// ---- GET TOTAL WITH TIMEOUT
function totalLast() {
    $('#cart-spinner').show()
    setTimeout(() => {
        $('#cart-spinner').hide()
        total()
    }, 500)
}
// ----

// ------ GET CART COUNTER ------
function cartCounter() {
    // check if user registred and get user id 
    // get user cart from local storage

    // get cart for guest
    let cart = getCartLS()
    let counter = 0
    if (cart) {
        cart.map(item => {
            counter += parseInt(item.q)
        })
        $('.cart-counter').html(counter).show()
    } else {
        $('.cart-counter').html(counter).hide()
    }
}

/* CHECK IF CART EMPTY AND SHOW EMPTY STATE */
function isCartEmpty() {
    if(!getCartItemsIdLS()) { // if local storage empty return false 
        $('#cart-items').html('<div class="cart-empty">Корзина пуста</div>')
    }
}

// ----- PRICE FORMAT -----
function numFormat(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}
// -----------------------

// CHANGE PRICE FORMAT GLOBAL
$('.price > div').each((index, element) => {
    $(element).text(numFormat($(element).text()))
})


// $('.price > div').text(numFormat($(this).text()))

// ----- ADD TO CART -----
$('.add-to-cart-s, .add-to-cart').click(function () {

    let id = $(this).data('id')
    // let color = $(this).data('color')
    // let size = $(this).data('size')
    // add id to cart for registred users 
    let cart = getCartLS()

    if (cart) {

        let findSameItem = cart.findIndex( item => item.p === parseInt(id) )

        console.log(findSameItem);
        

        if ( findSameItem !== -1 ) {
            
            // cart[foundIndex].q = parseInt(cart[foundIndex].q) + 1

            // If the same item has already in the cart just do nothing

        } else {

            //If it's not - push new to array
            let newItem = { "p": id, "q": 1 }
            cart.push(newItem)
        }

        // Save new cart array to localStorage
        localStorage.setItem('cart-guest', JSON.stringify(cart))
        $(this).addClass('add-checkmark')

    } else {

        localStorage.setItem('cart-guest', `[{"p":${id}, "q":1 }]`)

    }

    cartCounter()
    updateCart()
    totalLast()
    $('.cart-empty').hide()
    $('#cartModal').modal('show')
})

// ---

// --- SPECIAL SELECTOR FOR DYNAMIC CONTENT
// $('body').on('click', '.class', function() {}


// --- PLUS BUTTON ---
$('body').on('click', '.plusqty', function () {
    var id = $(this).attr('data-item')
    var price = $('.qty[data-item="' + id + '"]').attr('data-price')
    var qty = $('.qty[data-item="' + id + '"]')
    if (qty.val() <= 99) {
        qty.val(parseInt(qty.val()) + 1)
        var sum = numFormat((qty.val() * price))
        $('.sum-price[data-item="' + id + '"]').html(sum + " ₴")
        totalLast()
        updateQuantity(id, qty.val())
        cartCounter()
    }
});
// ---

// --- MINUS BUTTON ---
$('body').on('click', '.minusqty', function () {
    var id = $(this).attr('data-item')
    var price = $('.qty[data-item="' + id + '"]').attr('data-price')
    var qty = $('.qty[data-item="' + id + '"]')
    if (qty.val() > 1) {
        qty.val(parseInt(qty.val()) - 1)
        var sum = numFormat(qty.val() * price)
        $('.sum-price[data-item="' + id + '"]').html(sum + " ₴")
        totalLast()
        updateQuantity(id, qty.val())
        cartCounter()
    }
})
// ---

// --- INPUT CHANGE EVENT ---
$('body').on('change', '.qty', function () {
    var price = $(this).attr('data-price')
    var qty = $(this).val()
    var id = $(this).attr('data-item')
    var sum = numFormat(qty * price)
    $('.sum-price[data-item="' + id + '"]').html(sum + " ₴")
    totalLast()
    updateQuantity(id, qty)
    cartCounter()
})
// ---

// --- DELETE ITEM BUTTON ---
$('body').on('click', '.item-delete', function () {
    let id = $(this).attr('data-item')
    $('#item-' + id).remove()
    removeCartItemsLS(id)
    isCartEmpty()
    totalLast()
    cartCounter()
    // setCheckmark(getCartItemsIdLS())
})
// ---

// --- BASIC CALLS ----
getCartItemsIdLS()
cartCounter()
updateCart()
// ---

// --- GET TOTAL AFTER ALL
totalLast()

