const dataBase = require('./database/db')
const {subjects, weekdays, getSubject, convertHoursInMinutes} = require('./utils/format')

//Cria a rota para o index.html
function pageLanding(req, res){
    return res.render("index.html") 
}

//Cria a rota para a página study.html
async function pageStudy(req, res){
    const filters = req.query //req.query recebe os dados enviados pelo submit do formulário em forma de objeto

    if(!filters.subject || !filters.weekday || !filters.time) {

        return res.render("study.html", {filters, subjects, weekdays})
    } 

    // Converter horas em minutos
    const timeToMinutes = convertHoursInMinutes(filters.time)


    const query = `
        SELECT classes.*, proffys.* 
        FROM proffys
            JOIN classes 
            ON (classes.proffy_id = proffys.id)
            WHERE EXISTS(
                SELECT * FROM class_schedule
                WHERE class_schedule.class_id = classes.id
                AND class_schedule.weekday = ${filters.weekday}
                AND class_schedule.time_from <= ${timeToMinutes} 
                AND class_schedule.time_to > ${timeToMinutes}
            ) 
            AND classes.subject = '${filters.subject}' 
    `

    //Caso haja erro na consulta do BD
    try {
        const db = await dataBase
        const proffys = await db.all(query)

        proffys.map(proffy => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html' , {proffys, subjects, filters, weekdays})

    } catch (error) {
        console.log(error)
    }

    
    //Cria a rota para a página study.html e envia os dados do server para a página html
    // return res.render("study.html", {proffys, filters, subjects, weekdays}) 
}

//Cria a rota para a página give-classes.html
function pageGiveClasses(req, res){
    return res.render("give-classes.html", {subjects, weekdays}) 
}

async function saveClasses(req, res){
        const createProffy = require('./database/createProffy')

        const proffyValue = {
            name: req.body.name,
            avatar: req.body.avatar,
            whatsapp: req.body.whatsapp,
            bio: req.body.bio
        }      

        const classValue = {
            subject: req.body.subject,
            cost: req.body.cost
        }

        const classScheduleValues = req.body.weekday.map((weekday, index) => {

            return {
                    weekday,
                    time_from: convertHoursInMinutes(req.body.time_from[index]),
                    time_to: convertHoursInMinutes(req.body.time_to[index])
            }
        })

        try {
            const db = await dataBase
            await createProffy(db, {proffyValue, classValue, classScheduleValues})
            
            //Apresenta no link da página os dados do filtro (apenas para visualização do usuário)
            let queryString ="?subject=" + req.body.subject
            queryString += "&weekday=" + req.body.weekday[0]
            queryString += "&time=" + req.body.time_from[0]

            //Direciona para a pagina study + os dados do subject
            return res.redirect("/study" + queryString)

        } catch (error) {
            console.log(error)
        }
 }   

//Exporta as funções
module.exports = 
{
    pageLanding, 
    pageStudy,
    pageGiveClasses, 
    saveClasses
}