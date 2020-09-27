var length = 10; 
function fn() { 
 console.log(this.length); 
} 
var yd = { 
    length: 5, 
    method: function(fn) { 
        fn(); 
        arguments[0](); 
    } 
}; 
yd.method(fn, 1);