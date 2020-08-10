//Procura o botão
document.querySelector("#add-time")
//Quando cicar no botão
.addEventListener('click', cloneField) //Adiciona uma função ao evento click

//Executa uma ação
function cloneField(){
    //Duplicar os campos
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true) //Clona a div (se tiver (true) retorna todo o conteudo, se (false) retorna apenas a tag inicial sem seu conteúdo completo

    //Limpar os campos
    const fields = newFieldContainer.querySelectorAll('input')

    //Para cada campo, limpar
    fields.forEach(function(field){ //forEach percorre a lista

        //Pega o campo atual e limpa o valor dele
        field.value = ''
    })

    //Colocar novos campos na página
    document.querySelector('#schedule-items').appendChild(newFieldContainer)
}
    