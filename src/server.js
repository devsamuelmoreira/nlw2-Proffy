//Servidor
const express = require('express')
const server = express() 
const {
        pageLanding, 
        pageStudy, 
        pageGiveClasses, 
        saveClasses
      } = require('./pages')

//Configurando o nunjucks (template-engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true,
})

//Configurando e criando as rotas
server
//Recebe os dados do req.body
.use(express.urlencoded({ extended: true }))
//Configurando arquivos estáticos (css, scripts, imagens)
.use(express.static("public"))
//Crinado as rotas da aplicação
.get("/", pageLanding)
.get('/study', pageStudy)
.get('/give-classes', pageGiveClasses)
.post('/save-classes', saveClasses)
//Start do servidor
.listen(5500)