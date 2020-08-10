module.exports =  async function(db, {proffyValue, classValue, classScheduleValues}){
    //Insert proffys:
            //com await, os demais códigos só serão executados quando a função que ele está acompanhando concluir.
            //Para usar o await na chamada de uma função ela deve ter sido declarada com o termo async.
    const insertProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            "${proffyValue.name}", 
            "${proffyValue.avatar}",
            "${proffyValue.whatsapp}",
            "${proffyValue.bio}"
        );
    `)

    const proffy_id = insertProffy.lastID

    //Insert class:
    const insertClass = await db.run(`
         INSERT INTO classes (
            subject,
            cost,
            proffy_id
         ) VALUES (
             "${classValue.subject}",
             "${classValue.cost}",
             "${proffy_id}"
         );       
    `)
    const class_id = insertClass.lastID

    //Insert class_schedule:
    const insertAllClassScheduleValues = classScheduleValues.map((value) => {
        return db.run(`
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (
                "${class_id}",
                "${value.weekday}",
                "${value.time_from}",
                "${value.time_to}"
            );
        `)
    })

    //Aqui vou executar todos os db.runs() das class_schedules
    // await Promise.all(insertAllClassScheduleValues)

    //Consultar dados
        //Proffys
        const selectedProffys = await db.all("SELECT * FROM proffys")

        //Class x Proffys
        const selectedClassesXProffys = await db.all(`
            SELECT classes.* , proffys.* FROM proffys
                JOIN classes 
                ON (classes.proffy_id = proffys.id)
            WHERE classes.proffy_id = 1;
        `)

        //
        const selectClassesSchedules = await db.all(`
            SELECT * FROM class_schedule
            WHERE class_schedule.class_id = 1
            AND class_schedule.weekday = 0
            AND class_schedule.time_from <= "520" 
            AND class_schedule.time_to > "1220"
        `)

        console.log(selectClassesSchedules)

}