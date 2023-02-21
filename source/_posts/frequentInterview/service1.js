const http = require('http')
const fs = require('fs')


http.createServer((request, response) => {
    // response.end('231123')
    // fs.readFile('./test.html')

    const {headers, url} = request
    console.log('url---', url)
    if (request.url === '/') { 
        fs.createReadStream('./test.html').pipe(response)
    } else if (headers.accept.includes('image')) {
        response.writeHead(200, 'googgo', {
            'Cache-Control': 'max-age=10000'
        })
        fs.createReadStream(`./test.png`).pipe(response)
    }
}).listen('4001')

