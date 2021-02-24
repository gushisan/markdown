type IFoo = (
  uname: string,
  uage: number
) => {
  name: string;
  age: number;
};
//参数类型
type Ibar = Parameters<IFoo>;
// type Ibar = [uname: string, uage: number]
type T0 = ReturnType<IFoo>;
// type T0 = {
//     name: string;
//     age: number;
// }