$(document).ready(function(){

    //Search watch
    $('#search').keydown(function () { 
        // e.preventDefault()
        let word = $(this).val()
        
        if(word.length > 1) {
            console.log('run search');
        }
        
    })

})