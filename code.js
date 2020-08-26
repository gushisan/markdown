function fn(a) {
  console.log(a)
  var a = 123
  console.log(a)
  function a() {}
  console.log(a)
  console.log(b)
  console.log(d)
  var b = function() {}
  console.log(b)
  function d() {}
}

fn(1)