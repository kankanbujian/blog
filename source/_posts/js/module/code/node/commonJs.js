const a = require('./a.js')
let test = 1

let test2 = {val: 1}

// for (let i = 0 ; i < 10000; i++) {
//     console.log('i---', i)
// }

function updateVal() {
    test = 2
    test2.val = 2
}

const unused = 2

module.exports = {
    test, unused, updateVal, test2
}