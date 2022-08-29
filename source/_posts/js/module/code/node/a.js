// // export var a = 1
// export let a = 1
// import './b.js'

// // export function a() {
// //     console.log('afunction')
// // }
// // export default a

// export function b() {
//     a = 2
// }

// console.log('a----start', a)


console.log('a---', a)

let a = 1

{
    let a = 2

    console.log('a---another', a)
    {
        let a = 3
    }

}