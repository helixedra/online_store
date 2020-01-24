$(document).ready(function(){


    // Radio buttons select
    $('.radio-select').click(function(){

        function contentBlock(element, block){

            //If this block has content
            if (element.parent().has('div.selected-content').length) {
                //Hide all blocks
                $('.'+block+' > .selected-content').addClass('none')
                //Then show selected
                element.parent().children('.selected-content').removeClass('none')
            }
        }

        function activeRadio(element){

            //Get name of controls block
            let block = element.parent().attr('class')

            //Remove active status from all elements of block 
            $('.'+block+'> .radio-select > i').removeClass().addClass('far fa-circle')
            $('.'+block+'> .radio-select').removeClass('radio-active')

            //Add active status to selected item
            element.addClass('radio-active')
            element.children('i').attr('class','far fa-check-circle')

            contentBlock(element, block)

            let optionName = element.parent().attr('class')
            $('input[name='+optionName+']').val(element.data(optionName))
        }
  
        activeRadio($(this))

    })

    // Checkout cart

    
let dataItems = getCartItemsIdLS()
    // GET AND LOOP ITEMS IN CART
function checkoutCartItems(data) {
    // Pass 'data' from DB
    // Loop through 'data' and generate html items for cart
    let output = data.map(value => {
        return `<div class="item d-flex align-items-center justify-content-between" id="item-${value.id}" data-item-sum="${(currentItemQty(value.id) * value.price)}">
                <a href="/products/p/${value.uri}">
                <img src="/images/products/${value.uri}/${value.cover_img}" class="item-img" alt="${value.title}">
                </a>
                <div class="item-info" data-pid="${value.id}">
                    <div class="item-title">
                        <a href="/products/p/${value.uri}" class="reset-link">${value.title}</a>
                    </div>
                    <div class="item-code">Код товара: <span>${value.id}</span></div>
                </div>
                <div class="item-price" data-price="${value.price}">${numFormat(value.price)} ₴</div>
                <div class="item-qty" data-qty="${currentItemQty(value.id)}">
                ${currentItemQty(value.id)}
                    <input type="hidden" data-item="${value.id}" data-price="${value.price}" value="${currentItemQty(value.id)}">
                    
                </div>
                <div class="item-sum-price sum-price" data-item="${value.id}">${numFormat(currentItemQty(value.id) * value.price)} ₴</div>
                
            </div>`
    }).join('')
    
    return output
    /* >>> Return html for cart items */
}

function createOrder(){
    let cartItems = $('.checkout-cart > .item')
    let order = []
    cartItems.each(function(){   
        order.push(`pid=${$(this).children('.item-info').data('pid')};qty=${$(this).children('.item-qty').data('qty')};price=${$(this).children('.item-price').data('price')}`)
    })
    return order
}

function checkoutTotal() {
    let itemsTotal = $('.checkout-cart > .item')
    let total = 0
    itemsTotal.each(function(){
        total += $(this).data('item-sum')
    })
    
    $('.checkout-total-sum').html( numFormat(total)+' ₴' )
    $('input[name=order]').val(createOrder())
    $('input[name=total]').val(total)
}

function getCheckoutCart(data) {
    $.ajax({
        url: "/cart/getcart",
        type: "POST",
        dataType: "json",
        data: data,
        success: function (result) {
            let items = $.parseHTML(checkoutCartItems(result))
            $('.checkout-cart').html(items)
            checkoutTotal()
        }
    })
  
}



// getCheckoutCart(dataItems)

// 
getCheckoutCart(dataItems)
// getCheckoutCart(dataItems)


})