var $message = 'The E-Gaming Revolution is here to Stay . . .'.split('').reverse();

// Set the frequency of your 'pops'
var $timeout = 150;

var outputSlowly = setInterval(function() {

    // Add text to the target element
    $('#home-gif').append($message.pop());

    // No more characters - exit
    if ($message.length === 0) {
        clearInterval(outputSlowly);
    }
}, $timeout);


document.querySelector('#scroll-down-icon').addEventListener('click',()=>{
  alert('Hello Pankaj \n I Hope you like it.' )
});
