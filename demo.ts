type IConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;

class People {
  name: string
  age: number

  constructor(name: string) {
    this.name = name;
  }
}

var a = typeof People;


type IType = ConstructorParameters<typeof People>

type a = IConstructorParameters<typeof People>


type d = new (...args: any) => any