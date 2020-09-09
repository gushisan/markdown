this.a = 20;

var test = {
    a: 40,
    
    init: ()=> {
        console.log(this.a);
        function go() {
            this.a = 60

            console.log(this.a);
        }

        go.prototype.a = 50;

        return go;
    }
}

// var p = test.init();
// p();
// var p = new(test.init())
var f1 = test.init()
var f2 = new(test.init())
console.log(f1)
console.log(f2)
// console.log(p.prototype)