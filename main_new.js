//----------------------------------------------
//Настройки
const SERVER_URL = "http://localhost:3000";
//----------------------------------------------
//Чтение данных с сервера
async function serverGetClient(){
    let response = await fetch(SERVER_URL + '/api/clients',{
        method: "GET",
        headers: { 'Content-Type': 'application/json'},
    });
    let data = await response.json()
return data;
}
//----------------------------------------------

async function serverSearchClient(search){    
    let response = await fetch(SERVER_URL + '/api/clients' + '?search=' + search,{
        method: "GET",        
        headers: { 'Content-Type': 'application/json'},    
    });    
    let data = await response.json()
    render(data)
    return data;
}
    
//Добавление данных на сервер
async function serverAddClient(obj){
    let response = await fetch(SERVER_URL + '/api/clients',{
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(obj),
    });
    let data = await response.json()
    const errors = Array.from(document.getElementsByClassName('error__alert'));
        if (response.ok) {
            
            for(let i = 0; i < errors.length; i++) {
                errors[i].remove();
            };

            addBlock.classList.remove("active")

            console.log('Добавление клиента', data);
            let serverData = await serverGetClient()
            console.log(serverData)
            render(serverData)

            addSurname = document.getElementById("addSurname")
            addSurname.value = ""
            addSurname.placeholder = "Фамилия*"
        
            addName = document.getElementById("addName")
            addName.value = ""
            addName.placeholder = "Имя*"
        
            addLastName = document.getElementById("addLastName")
            addLastName.value = ""
            addLastName.placeholder = "Отчество*"
        
        }
        else{
            for(let i = 0; i < errors.length; i++) {
             errors[i].remove();
             };

            for(const error of data.errors){
                let errorF = document.createElement("span")
                let addSave = document.getElementById("addSave") 
                addSave.before(errorF)  
                
                for(let i = 0; i < data.errors.length; i++) {
                    errorF.classList.add("error__alert")
                    errorF.textContent = error.message
                    }          
                }
                console.log("Ошибки:", data.errors)
                return 0
        }
}

//----------------------------------------------
//Удаление данных с сервера
async function serverDeleteClient(id){
    let response = await fetch(SERVER_URL + '/api/clients/' + id,{
        method: "DELETE",
    });
    let data = await response.json()
return data;
}
//----------------------------------------------
// Изменение клиента на сервере
async function serverChangeClient(id, newObj){
    const response = await fetch('http://localhost:3000' + '/api/clients/' + id,{
        method: "PATCH",
        body: JSON.stringify({
            surname: newObj.surname,
            name: newObj.name,
            lastName: newObj.lastName,
            contacts : newObj.contacts,
        })
})
let serverData = await serverGetClient()
render(serverData)

let data = await response.json()
return data;
}
//----------------------------------------------
//Отрисовка на экране
function render(arr) {
    const tbody = document.querySelector("#tbody")
    tbody.innerHTML = ''
    
    let copyArr = [...arr]
    for (const clientObj of copyArr) {
      const $newTr = getNewClientTR(clientObj)
      tbody.append($newTr)
    }
}
//----------------------------------------------
//Представление даты в формате день.месяц.год
function formatDate(date) {
    
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) mm = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}
//----------------------------------------------
// Адаптив развертка таблицы

const INDEX_TRIGGER_SIZE = 110;
const wrap = document.querySelector(".table__wrap");
const head = wrap.querySelector(".thead");

wrap.addEventListener("scroll", () => {
  if (head.offsetTop > INDEX_TRIGGER_SIZE) {
    head.style.zIndex = "0";
  } else {
    head.style = "";
  }
});
//----------------------------------------------
//Создание таблицы из переданного объекта

function getNewClientTR(clientObj) {
    const $tbody = document.getElementById("tbody");
    //console.log(clientObj)
    const $tr = document.createElement("tr")
    const $tdID = document.createElement("td")
    const $tdFIO = document.createElement("td")
    const $tdAdd = document.createElement("td")
    const $tdUpdate = document.createElement("td")
    const $tdContacts = document.createElement("td")
    const $tdActions = document.createElement("td")
    const $linkPatch = document.createElement("a")
    const $linkPatchBlock = document.createElement("div")
    const $linkDelete = document.createElement("a")
    const $linkDeleteBlock = document.createElement("div")

//ИКОНКИ КНОПОК УДАЛЕНИЯ/ИЗМЕНЕНИЯ

    let patchImg = document.createElement("img")
    let deleteImg = document.createElement("img")

    patchImg.classList.add("patch__img")
    patchImg.src = "/img/edit.svg"
    $linkPatch.textContent = "Изменить"
    
    deleteImg.src = "/img/cancel.svg"
    $linkDelete.textContent = "Удалить"
//----------------------------------------------
// УДАЛЕНИЕ

    $linkDelete.addEventListener('click', function(){
        deleteForm(clientObj, $tr)
    })
//----------------------------------------------
// ИЗМЕНЕНИЕ

    $linkPatch.addEventListener("click", function(){
        patchForm(clientObj, $tr)
        patchSelect(clientObj)
    })
//----------------------------------------------
//Контент таблицы

    let spanID = document.createElement("span")
    let spanAdd = document.createElement("span")
    let spanUpdate = document.createElement("span")

    spanID.classList.add("span")
    
    spanAdd.classList.add("span")
    
    //console.log(clientObj)
    spanUpdate.classList.add("span")

    spanID.textContent = `${clientObj.id}`
    $tdFIO.textContent = `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`

    spanAdd.textContent =  new Date(clientObj.createdAt).toTimeString().substr(0,5)
    $tdAdd.innerHTML = `${formatDate(new Date(clientObj.createdAt))}`;

    spanUpdate.textContent = new Date(clientObj.updatedAt).toTimeString().substr(0,5)
    $tdUpdate.textContent =  `${formatDate(new Date(clientObj.updatedAt))}`;

    //Иконки контактов

    const contactsIcons = {
        VK : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/></g></svg>`,
    
        tel: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><circle cx="8" cy="8" r="8" fill="#9873FF"/><path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/></g></svg>`,

        Facebook : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/></g></svg>`,
      
        Email : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/></svg>`
    };

    
      const START_CONTACTS_QUANT = 4;
      
    function createContactEl(contactObj) {
        const contactEl = document.createElement('li');
        const contactBtn = document.createElement('button');
        const contactsTooltip = document.createElement("span")
        contactsTooltip.innerHTML  = contactObj.type + " : " + contactObj.value
        contactEl.classList.add("contacts__item")
        contactBtn.classList.add("contacts__element")
        contactsTooltip.classList.add("contacts__tooltip")

            let type
            switch (contactObj.type) {
                case 'Телефон': type='tel'; break;
                case 'Доп.телефон': type='tel'; break;
                case 'VK': type='VK';break;
                case 'Email': type='Email';break;
                case 'Facebook': type='Facebook';break;
                default: type='';
            }
            contactBtn.innerHTML = contactsIcons[type];
            contactBtn.append(contactsTooltip)
            contactEl.append(contactBtn);
        return contactEl;
      }

      function renderRestContacts(contactsArr, list) {
        
        for (let i = START_CONTACTS_QUANT; i < contactsArr.length; i++) {
          const item = createContactEl(contactsArr[i]);
          list.append(item);
        }
      }
    
      function createShowMoreBtn(list, contactsArr) {
        const btn = document.createElement('button');
        btn.classList.add("contacts__more")
        const restContacts = contactsArr.length - START_CONTACTS_QUANT;

            btn.textContent = `${restContacts}+`;
        
            btn.addEventListener('click', () => {
                renderRestContacts(contactsArr, list);
                btn.remove();
            });
            return btn;
      }
    
      function renderStartContacts(contactsArr) {
        const contactsWrap = document.createElement('div');
        contactsWrap.classList.add("contacts__wrap")
        const contactsList = document.createElement('ul');
        contactsList.classList.add("contacts__list")
        const iterationCount = contactsArr.length < START_CONTACTS_QUANT ? contactsArr.length : START_CONTACTS_QUANT;
        
            for (let i = 0; i < iterationCount; i++) {
            const item = createContactEl(contactsArr[i]);
            contactsList.append(item);
            }
        
            contactsWrap.append(contactsList);
        
            if (contactsArr.length > START_CONTACTS_QUANT) {
            const btn = createShowMoreBtn(contactsList, contactsArr);
            contactsWrap.append(btn);
            }

        return contactsWrap;
      }

    if (clientObj.contacts.length>0) $tdContacts.append(renderStartContacts(clientObj.contacts));

//----------------------------------------------

    let contactsDiv = document.createElement("div")
    contactsDiv.classList.add("contacts__div")
    $linkPatchBlock.classList.add("link__patch-margin")
    $linkPatchBlock.append(patchImg)
    $linkPatchBlock.append($linkPatch)

    $linkDeleteBlock.classList.add("link__delete-margin")
    $linkDeleteBlock.append(deleteImg)
    $linkDeleteBlock.append($linkDelete)

    contactsDiv.append($linkPatchBlock)
    contactsDiv.append($linkDeleteBlock)
    $tdActions.append(contactsDiv)
    $tdID.append(spanID)
    $tdAdd.append(spanAdd)
    $tdUpdate.append(spanUpdate)
    $tr.append($tdID, $tdFIO, $tdAdd, $tdUpdate, $tdContacts ,$tdActions)
    $tbody.append($tr)
    return $tr
}
//----------------------------------------------
let serverData = await serverGetClient()
render(serverData)
//----------------------------------------------

// Форма удаления

function deleteForm(clientObj, $tr) {
        
    let deleteBlock = document.createElement("div")
    let deleteBlockContent = document.createElement("div")
    let deleteTitle = document.createElement("h2")
    let deleteText = document.createElement("p")
    let deleteBtn = document.createElement("button")
    let deleteCancel = document.createElement("a")
    let deleteWindow = document.querySelector("#deleteWindow")

    deleteBlock.classList.add("delete__client-block")
    
    deleteBlockContent.classList.add("delete__block-content")
    
    deleteTitle.classList.add("delete__title", "reset")
    deleteTitle.textContent = "Удалить клиента"
    
    deleteText.classList.add("delete__text")
    deleteText.textContent = "Вы действительно хотите удалить данного клиента?"
    
    deleteBtn.classList.add("delete__btn")
    deleteBtn.textContent = "Удалить"
    
    deleteCancel.classList.add("cancel__link")
    deleteCancel.textContent = "Отмена"

    deleteBlockContent.append(deleteTitle, deleteText, deleteBtn, deleteCancel)
    deleteBlock.append(deleteBlockContent)
    
    deleteWindow.append(deleteBlock)
    
    deleteBtn.addEventListener('click', async function(){  
        await serverDeleteClient(clientObj.id)
        $tr.remove()
        deleteBlock.remove()
        serverData.shift(clientObj)
        
    })

    deleteCancel.addEventListener('click', function(){
        deleteBlock.remove()
    })
}

//----------------------------------------------

//Отображение формы добавления при клике на добавить клиента

const addForm = document.getElementById("addButton")
const addBlock = document.getElementById("addBlock")
addForm.addEventListener("click", function(){
    addBlock.classList.add("active")
    contactsAdd.classList.remove("hidden")
})
//----------------------------------------------
//Закрытие формы добаления при клике на крестик и отмена
const addClose = document.getElementById("addClose")
addClose.addEventListener("click", function(){
    addBlock.classList.remove("active")
})

const addCancel = document.getElementById("addCancel") 
    addCancel.addEventListener("click", function(){
        addBlock.classList.remove("active")
})
//----------------------------------------------
function addFormSelect(data) {
    let contactsInputBlock = document.createElement("div")
    let inputContact = document.createElement("input");
    let closeABC = document.createElement("div")
    let closeIMG = document.createElement("div")
    let contactsFormAdd = document.getElementById("contactsFormAdd")
    let optionsArray = ["Телефон","Доп.телефон","Email", "VK", "Facebook"];
    let selectList = document.createElement("select")
   
    contactsInputBlock.classList.add("flex", "contacts__add-block")
    inputContact.classList.add("contacts__input")
    inputContact.placeholder = "Введите данные контакта";
    closeABC.classList.add("closeABC")
    closeIMG.classList.add("closeIMG")
    selectList.classList.add("contacts__select")
    inputContact.before(selectList);

    for (let i = 0; i < optionsArray.length; i++) {
        let option = document.createElement("option");
        option.value = optionsArray[i];
        option.text = optionsArray[i];
        selectList.appendChild(option);
    }
    closeABC.append(closeIMG)
    contactsInputBlock.append(selectList, inputContact, closeABC)
    contactsFormAdd.append(contactsInputBlock)

    closeABC.addEventListener('click', async function(){ 
        contactsInputBlock.remove()
    })      
}

document.querySelector("#contactsAdd").addEventListener("click", function(){
    let contactsAdd = document.querySelector("#contactsAdd")
    if (contactsFormAdd.length<20) {
        addFormSelect()
    }
    else {
        contactsAdd.classList.add("hidden")
    }
})

// Сохранение формы добавления

const btnSave = document.getElementById("addSave")
btnSave.addEventListener("click", async function(){

    let addSurname = document.getElementById("addSurname")
    addSurname.addEventListener("click", function(){
        let surnameLabel = document.getElementById("surnameLabel")
        surnameLabel.classList.remove("hidden")
        addSurname.placeholder = ""
    })

    let addName = document.getElementById("addName")
    addName.addEventListener("click", function(){
        let nameLabel = document.getElementById("nameLabel")
        nameLabel.classList.remove("hidden")
        addName.placeholder = ""
    })

    let addLastName = document.getElementById("addLastName")
    addLastName.addEventListener("click", function(){
        let lastNameLabel = document.getElementById("lastNameLabel")
        lastNameLabel.classList.remove("hidden")
        addLastName.placeholder = ""
    })
    
    let elem = document.getElementById("contactsFormAdd").elements
        let elemLength = elem.length
        let newContacts = []
        let inputField, selectField
    
        let c = 0 
        for (let i=0;i<elemLength;i++) {
            let type = elem[i].type
            let value = elem[i].value
            
            if ( type === 'text') inputField=value
            else selectField=value
            
            if (i>0 && (i % 2 === 0)) c++ 
            newContacts[c] = {
                type: selectField,
                value:inputField
            }
        }
    
        let newClientObj = {
            surname: document.getElementById("addSurname").value,
            name: document.getElementById("addName").value,
            lastName: document.getElementById("addLastName").value,
            contacts : newContacts,
        }
    
        let surnameLabel = document.getElementById("surnameLabel")
        surnameLabel.classList.add("hidden")
    
        let nameLabel = document.getElementById("nameLabel")
        nameLabel.classList.add("hidden")
    
        let lastNameLabel = document.getElementById("lastNameLabel")
        lastNameLabel.classList.add("hidden")
    
        contactsFormAdd.innerHTML = ""
        serverAddClient(newClientObj)
});

function patchForm (clientObj, $tr) {

    let patchBlock = document.createElement("div")
    let patchContainer = document.createElement("div")
    let closeBlock = document.createElement("div")
    let patchTitle = document.createElement("h2")
    let idClient = document.createElement("p")
    let patchCloseLink = document.createElement("a")
    let patchClose = document.createElement("span")
    let patchForm = document.createElement('form')
    let inputSurnameLabel = document.createElement("label")
    let patchInputSurname = document.createElement('input')
    let inputNameLabel = document.createElement("label")
    let patchInputName = document.createElement('input')
    let inputLastNameLabel = document.createElement("label")
    let patchInputLastName = document.createElement('input')
    let contactsBlock = document.createElement("div")
    let contactsPatch = document.createElement("a")
    let contactsImg = document.createElement("div")
    let contactsFormPatch = document.createElement("form")
    let patchSave = document.createElement("button")
    let patchDelete = document.createElement("a")

    patchBlock.classList.add("patch__block")
    
    patchContainer.classList.add("patch__container")
    patchContainer.setAttribute('id', 'patchContainerID')

    closeBlock.classList.add("close__block")
    
    patchTitle.classList.add("patch__title")
    patchTitle.textContent = "Изменить данные"
    
    idClient.classList.add("patch__id")
    idClient.textContent = "ID:" + clientObj.id
    
    patchCloseLink.classList.add("patch__close-link")
    
    patchClose.classList.add("patch__close")
    
    patchForm.classList.add('patch__form')
   
    
    inputSurnameLabel.classList.add("patch__label")
    inputSurnameLabel.textContent = "Фамилия*"
    
    patchInputSurname.classList.add('patch__input')
    patchInputSurname.placeholder = "Фамилия"
    patchInputSurname.value = clientObj.surname
    patchInputSurname.setAttribute('id', 'patchSurnameID')
    
    inputNameLabel.classList.add("patch__label")
    inputNameLabel.textContent = "Имя*"
    
    patchInputName.classList.add('patch__input')
    patchInputName.placeholder = "Имя"
    patchInputName.value = clientObj.name
    patchInputName.setAttribute('id', 'patchNameID')
    
    inputLastNameLabel.classList.add("patch__label")
    inputLastNameLabel.textContent = "Отчество*"
    
    patchInputLastName.classList.add('patch__input')
    patchInputLastName.placeholder = "Отчество"
    patchInputLastName.value = clientObj.lastName
    patchInputLastName.setAttribute('id', 'patchLastNameID')
   
    contactsBlock.classList.add("contacts__block")
    
    contactsPatch.classList.add("contacts__patch")
    contactsPatch.textContent = "Добавить контакт"
    
    contactsImg.classList.add("patch__contacts-img")
    
    contactsFormPatch.classList.add("contacts__form")
    contactsFormPatch.setAttribute('id', 'contactsFormPatch')
    
    
    patchSave.classList.add("patch__save")
    patchSave.textContent = "Сохранить"
    
    patchDelete.classList.add("patch__cancel")
    patchDelete.textContent = "Удалить клиента"

    closeBlock.append(patchTitle, idClient, patchCloseLink, patchClose)
    patchForm.append(inputSurnameLabel, patchInputSurname, inputNameLabel, patchInputName, inputLastNameLabel, patchInputLastName)
    contactsPatch.append(contactsImg)
    contactsBlock.append(contactsPatch, contactsFormPatch)
    patchContainer.append(closeBlock, patchForm, contactsBlock, patchSave, patchDelete)
    patchBlock.append(patchContainer)

    let patchWindow = document.querySelector("#patchWindow")
    patchWindow.append(patchBlock)

    // ЗАКРЫТИЕ ПРИ КЛИКЕ НА КРЕСТИК

    closeBlock.addEventListener('click', function(){
        patchBlock.remove()
    })

    // ЗАКРЫТИЕ ПРИ КЛИКЕ НА КНОПКУ СОХРАНИТЬ

    patchSave.addEventListener("click", function(){
        let elem = document.getElementById("contactsFormPatch").elements
        let elemLength = elem.length
        let newContacts = []
        let inputField, selectField

        let c = 0 
        for (let i=0;i<elemLength;i++) {
            let type = elem[i].type
            let value = elem[i].value
            
            if ( type === 'text') inputField=value
            else selectField=value
            
            if (i>0 && (i % 2 === 0)) c++ 
            newContacts[c] = {
                type: selectField,
                value:inputField
            }
        }

        let newClientObj = {
            surname: document.getElementById("patchSurnameID").value,
            name: document.getElementById("patchNameID").value,
            lastName: document.getElementById("patchLastNameID").value,
            contacts : newContacts,
        }

        serverChangeClient(clientObj.id, newClientObj)
        patchBlock.remove()
    })

    // ДОБАВЛЕНИЕ КОНТАКТА

    contactsPatch.addEventListener("click", function(){
       
        if (contactsFormPatch.length<20) {
            selectPatch()
        }
        else {
            contactsPatch.classList.add("hidden")
        }
    })

    // УДАЛЕНИЕ В ФОРМЕ ИЗМЕНЕНИЯ

    patchDelete.addEventListener('click', async function(){
        patchFormDelete(clientObj, $tr, patchBlock)
    })

} 

function selectPatch() {
    let contactsPatchBlock = document.createElement("div")
    contactsPatchBlock.classList.add("flex", "contacts__patch-block")
    let inputContact = document.createElement("input");
    inputContact.classList.add("contacts__input")
    inputContact.placeholder = "Введите данные контакта";
    let optionsArray = ["Телефон","Доп.телефон","Email", "VK", "Facebook"];

    let selectList = document.createElement("select")
    selectList.classList.add("contacts__select")
    inputContact.before(selectList);

    for (let i = 0; i < optionsArray.length; i++) {
        let option = document.createElement("option");
        option.value = optionsArray[i];
        option.text = optionsArray[i];
        selectList.appendChild(option);
    }
    //console.log(contactsFormPatch.length+2)

    contactsPatchBlock.append(selectList, inputContact)
    contactsFormPatch.append(contactsPatchBlock)
}

//Удаление клиента в форме изменить

async function patchFormDelete(clientObj, $tr, patchBlock){
    await serverDeleteClient(clientObj.id)
    $tr.remove()
    serverData.shift(clientObj)
    patchBlock.classList.add("hidden")
}

//Отображение и удаление контактов в форме изменить

function patchSelect(clientObj){
    for(let d=0; d < clientObj.contacts.length; d++)  {
        let contactsPatchBlock = document.createElement("div")
        contactsPatchBlock.classList.add("flex", "contacts__patch-block")
        let inputContact = document.createElement("input");
        inputContact.classList.add("contacts__input")
        inputContact.placeholder = "Введите данные контакта";

        let optionsArray = ["Телефон","Доп.телефон","Email", "VK", "Facebook"];
        let closeABC = document.createElement("div")
        closeABC.classList.add("closeABC")
        let closeIMG = document.createElement("div")
        closeIMG.classList.add("closeIMG")

        let selectList = document.createElement("select")
        selectList.classList.add("contacts__select")
        inputContact.before(selectList);

        for (let i = 0; i < optionsArray.length; i++) {
            let option = document.createElement("option");
            option.value = optionsArray[i];
            option.text = optionsArray[i];
            selectList.appendChild(option);
        }

        selectList.value = clientObj.contacts[d].type
        inputContact.value = clientObj.contacts[d].value

        closeABC.append(closeIMG)
        contactsPatchBlock.append(selectList , inputContact, closeABC)
        contactsFormPatch.append(contactsPatchBlock)

        closeABC.addEventListener('click', async function(){ 

            contactsPatchBlock.remove()
            
            for (let i = 0; i < serverData.length; i++) {
                
                if (clientObj.id === serverData[i].id)  {
                    delete serverData[i].contacts[d]
                }
            }
        })      

    }
}

// Сортировка
    
const idLink = document.querySelector('#idLink');
const fioLink = document.querySelector('#fioLink');
const createdLink = document.querySelector('#createdLink');
const updatedLink = document.querySelector('#updatedLink');

// Сортировка по ID

idLink.addEventListener('click',async () => {
    function SortArrayId(x, y) {
        if (x.id < y.id) { return -1; }
        if (x.id > y.id) { return 1; }
        return 0;
    }
    let serverData = await serverGetClient()
    const sortId = serverData.sort(SortArrayId);
    render(sortId);
});
//----------------------------------------------
// Сортировка по фамилии

fioLink.addEventListener('click',async () => {
    function SortArrayFio(x, y) {
        if (x.surname < y.surname) { return -1; }
        if (x.surname > y.surname) { return 1; }
        return 0;
    }
    let serverData = await serverGetClient()
    const sortFio = serverData.sort(SortArrayFio);
    render(sortFio);
});
//----------------------------------------------
// Сортировка по дате создания

createdLink.addEventListener('click',async () => {
    function SortArrayCreated(x, y) {
        if (x.createdAt < y.createdAt) { return -1; }
        if (x.createdAt > y.createdAt) { return 1; }
        return 0;
    }
    let serverData = await serverGetClient()
    const sortCreated = serverData.sort(SortArrayCreated);
    render(sortCreated);
});
//----------------------------------------------
// Сортировка по дате обновления

updatedLink.addEventListener('click',async () => {
    function SortArrayUpdated(x, y) {
        if (x.updatedAt < y.updatedAt) { return -1; }
        if (x.updatedAt > y.updatedAt) { return 1; }
        return 0;
    }
    let serverData = await serverGetClient()
    const sortUpdated = serverData.sort(SortArrayUpdated);
    render(sortUpdated);
});
//----------------------------------------------
// Поиск клиента в таблице
const inputSearch = document.querySelector("#inputSearch")
inputSearch.addEventListener("input", function(){
    let inputSearch = document.getElementById("inputSearch").value
    setTimeout(() => {  serverSearchClient(inputSearch)  }, 300);
})

 
