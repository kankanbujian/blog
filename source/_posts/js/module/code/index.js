let esprima = require('esprima');           //源代码转成AST语法树
let estraverse = require('estraverse');     //遍历语法树
let {generate} = require('escodegen');       //把AST语法树重新生成代码的工具

let sourceCode = `
    var a = 1
    var b = 2
`
let ast = esprima.parse(sourceCode);

let indent = 0;
function pad(){
    return "  ".repeat(indent)
}
estraverse.traverse(ast,{
    enter(node){
        // console.log(pad() + node.type);
        if (node.type === 'Literal') {
            console.log(node);
            node.value += 2;
        }
        indent += 2;
    },
    leave(node){
        indent -= 2;
        console.log(pad() + node.type)
    }
})

console.log(generate(ast));