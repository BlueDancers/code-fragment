function sayHello(person: string) {
  return 'hello' + person
}
let user = 'vkcyan'
console.log(sayHello(user))

let isDone: boolean = false

let Bool: boolean = Boolean(1)
let de: number = 8
let no: number = NaN
let infin: number = Infinity
let Name: string = '111'
let Age: string = '25'

function alertName(): void {
  console.log('name')
}
let NNN: any = 'seven'

NNN = 7

console.log(NNN.fileName)

interface Persss {
  readonly id: number
  age?: string
  [propName: string]: any //一旦定义了任意属性，那么确定属性和可选属性都必须是它的子属性
}
let toms: Persss = {
  id: 3111,
  name: 'Tom',
  gender: 'male'
}

// toms.id = 33131 // 只读属性无法赋值
//只读属性约束出渣于第一次给对象赋值的时候,而不是第一次给只读对象赋值的时候

let fibon: number[] = [1, 2, 3, 4, 5, 6] //不可以出现number之外的类型
let arr: any[] = [1, '2313']
//也可以使用泛型

let fibons: Array<number> = [1, 2, 3, 4, 5, 5]

//接口年表示是数组
interface Numberarray {
  //这奇怪的写法
  [index: string]: any
}

let fi: Numberarray = ['12313123131', 2312]

//最常见的写法
let list: any = [
  1,
  'lisi',
  {
    name: 'asdasas'
  }
]

//关于一些类数组
//关于类数组,不是数组类型是一些独立的接口
function sum() {
  let args: IArguments = arguments //IArguments 例如这个
}

// 常见的有IArgument NodeList HTMLCollection 等等

//函数
function susm(x: number, y: number): number {
  return x + y
}
susm(1, 2)

let mySum = function(x: number, y: number): number {
  return x + y
}

mySum(1, 2)

let mySums: (x: number, y: number) => number = function(
  x: number,
  y: number
): number {
  return x + y
}
// 在typescript里面, => 表示函数1的定义,左边是输出类型,需要使用括号括起来,右边是输出类型
mySums(1, 2)

//感觉写法基本一样的,,功能也是基本一样的

interface SearchFun {
  (souce: string, subString: string): boolean
}

let mySearch: SearchFun

mySearch = function(souce: string, subString: string) {
  return souce.search(subString) !== -1
}
//接口的形式定义函数的新装

function buildName(firstName: string, lastName?: string) {
  if (lastName) {
    return firstName + lastName
  } else {
    return firstName
  }
}

// lastName ?: 表示可变参数

let tomcat = buildName('tom', 'cat')
let tom = buildName('tom')

// 规定:可选参数后端不允许再出现必须参数

function buildNames(firstName: string, lastName: string = 'Cat') {
  return firstName + lastName
}
let tomcats = buildNames('tom', 'cat')
let tomss = buildNames('tom')

//给定默认值就不会受限制了

// 如果是第一个参数是可选参数呢
function buildNamess(firstName: string = 'Tom', lastName: string) {
  return firstName + lastName
}

let tomCaat = buildNamess('tom', 'cat')
let catsss = buildNamess(undefined, 'Cat')

function push(array: any[], ...item: any[]): any[] {
  item.forEach(e => {
    array.push(item)
  })
  return array
}

let a: any[] = []
push(a, 1, 2, 3, 4)

function reverse(x:number|string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join())
  } else if (typeof x === 'string'){
    return x.split('').reverse().join()
  }
}


