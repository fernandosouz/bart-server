var http = require('http');
var fs = require('fs');
var formidable = require('formidable');

function send404Response(response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Erro 404: Página não encontrada!");
    response.end();
}

function onRequest(request, response){
    /*Open index*/
    if(request.method == 'GET' && request.url == '/'){
        response.writeHead(200, {"Content-Type": "text/html"});
        fs.createReadStream("./index.html").pipe(response);

    /*Save file in tmp*/
    }else if(request.method == 'POST' && request.url == '/fileupload'){
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = '/tmp/' + files.filetoupload.name + '_copia';
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                response.write('Seu arquivo foi salvo: ' + newpath);
                response.end();
            });
        });
    }else{
        send404Response(response);
    }
}

http.createServer(onRequest).listen(8888);
console.log("Seu servidor está no ar!");
console.log("http://localhost:8888/ ");