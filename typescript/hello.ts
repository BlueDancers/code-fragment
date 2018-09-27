function sayHello(person: string) {
    return 'hello' + person
}
let user = 'vkcyan'
console.log(sayHello(user));

let isDone: boolean = false

let Bool: boolean = Boolean(1)
let de:number = 8
let no:number = NaN
let infin:number = Infinity
let Name: string = '111'
let Age : string = '25'


function alertName() : void{
    console.log('name')
}
let NNN : any = 'seven'

NNN = 7

console.log(NNN.fileName);



interface Persss {
    readonly name: string;
    age?: string;
    [propName: string] :any;
}
let toms: Persss = {
    id: 3111,
    name: 'Tom',
    gender: 'male'
}
toms.id = 33131

