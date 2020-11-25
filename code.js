function fn(){
    console.log(this.length);
  }

  const res = fn.bind(null)
  res();