// import { a } from './a.js'

// export const b = 1
// console.log('b----a=', a)

// import a from './a.js'

// export const b = 1
// console.log('b----a=', a)

const {a} = require('./a.js')
console.log('b-----a = ', a)
let b = 1
module.exports = {
    b
}
