
define(function () {
    let amd = function (x, y) {

        return x + y;

    };
    for (let i = 0; i < 10000; i++) {
        console.log('i---', i)
    }
    return {

        amd
    };

});


// // 有依赖项

define(['./a.js', 'b', 'c'], function (a, b,c ) {
    let amd = function (x, y) {

        return x + y;

    };
    for (let i = 0; i < 10000; i++) {
        console.log('i---', i)
    }
    return {

        amd
    };

});
