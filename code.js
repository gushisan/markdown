var s = [];
var arr = s;
for (var i = 0; i < 3; i++) {
 var pusher = {
 value: "item"+i
 },tmp;
 if (i !== 2) {
 tmp = []
 pusher.children = tmp
 }
 arr.push(pusher);
 arr = tmp;
}
console.log(s[0]);