// LOGIN

// Validation

function validate() {
    let email = $('#emailField').val()
    let password = $('#passwordField').val()
    let emailValid = false
    let passwordValid = false
    
    // Validate email
    if ( email === '' ) {
        showError('email', 'Введите свой E-mail')
    } else if ( email.replace(/\s+/g, '').length <= 3 ) {
        showError('email', 'Введите корректный E-mail')
    } else if ( !/(.+)@(.+){2,}\.(.+){2,}/.test(email) ) {
        showError('email', 'Введите корректный E-mail')
    } else {
        hideError('email')
        emailValid = true
    }

    // Validate password
    if ( password === '' ) {
        showError('password', 'Введите пароль')
    } else if ( /[^\w+ !"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]/gi.test(password) ) {
        showError('password', 'Смените раскладку клавиатуры')
    } else {
        hideError('password')
        passwordValid = true
    }
    
    // Rerurn global validation status
    if ( emailValid && passwordValid ) {
        return true
    } else {
        return false
    }

}

$('input[name=email]').on('change paste keyup', function(){
    validate()
})
$('input[name=password]').on('change paste keyup', function(){
    validate()
})

function showError(input, error) {
    if ( $('#'+input+'Error').html() === undefined ) {
        $('input[name='+input+']').addClass('input-error').after( "<div class='error-msg' id='"+input+"Error'>"+error+"</div>" )
    } else {
        $('#'+input+'Error').html(error)
    }
}

function hideError(input) {
    $('#'+input+'Error').remove()
    $('input[name='+input+']').removeClass('input-error')
}

$("#loginForm").submit(function(e){
    e.preventDefault();
    
    // Return validation status true||false
    let validationResponse = validate()

    if (validationResponse) {
        login($(this))
    }
});

function login(data) {
    $.ajax({
        url: "/user/login",
        type: "POST",
        data: data.serialize(),
        success: function (result) {
            if (result) {
                if(result.status === 'success'){
                    statusLogin()
                    $(function () {
                        $('#loginModal').modal('toggle');
                     })
                     $('.login-msg-success').html(result.message)
                     $('#loginSuccess').show()
                     fadeError()
                } else {
                    $('.login-msg').html(result.message)
                    $('#loginError').show()
                    fadeError()
                }
            } 
        }
    })
}

function statusLogin() {
    $.get('/user/login', {auth:'status'}, function(res) {
        if (res) {
            $('#user-menu').show()
            $('#guest-menu').hide()
        } else {
            $('#user-menu').hide()
            $('#guest-menu').show()
        }
    })
}

function fadeError () {
    setTimeout(()=>{
        $('.alert').hide()
    }, 10000)
}


$(window).on('load', function(){
    // $.ajax({
    //     // async: false,
    //     url: "/login?auth=status",
    //     type: "GET",
    //     dataType: 'json',
    //     data: {auth: 'status' },
    //     success: function(response) {
    //         console.log(response);
    //     }
    // })
    statusLogin()
})

$('.pass-eye').on('click', function(){
    let input = $(this).attr('data-eye')
    let inputAttr = $('input[data-eye="'+input+'"]').attr('type')
    if(inputAttr === 'password') {
        $('input[data-eye="'+input+'"]').attr('type','text')
        $(this).html('<i class="far fa-eye"></i>')
    } else {
        $('input[data-eye="'+input+'"]').attr('type','password')
        $(this).html('<i class="far fa-eye-slash"></i>')
    }
})
