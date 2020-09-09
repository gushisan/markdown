var f1 = () => {
    console.log(this);
}

var obj={
    x:10,
    fn: f1
}

f1(); // window
obj.fn(); // Window
f1.call(obj) // Window
f1.apply(obj) // Window
f1.bind(obj)() // Window


// for (
//     let i = (setTimeout(_ => console.log('a->', i)));
//     setTimeout(_ => console.log('b->', i)), i < 2;
//     i++) {
//     i++
// }