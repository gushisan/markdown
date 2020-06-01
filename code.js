Promise.resolve().then(() => {
  console.log('mm')
  Promise.resolve().then(() => {
    console.log('xx')
  }).then(() => {
    console.log('yy')
  });
}).then(() => {
  console.log('nn')
})