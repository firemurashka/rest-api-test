//подключаем express
//Require () - это вызов функции в JavaScript, который используется для импорта модуля и т. Д. В текущий файл, над которым вы работаете.
const express = require('express')
    //встроееный модуль path для работы с путями
const path = require('path')
    //создаю объект приложения, через вызов функции express
const app = express()
    //подключаем библиотеку uuid для id
const {
    v4
} = require('uuid')

//наша база данных 
let CONTACTS = [
    //значения по-умолчанию
    {
        //v4() - генерирует новый id
        id: v4(),
        name: 'Виктория',
        value: '+7-921-384-68',
        marked: false
    }
]

//для работы с req
app.use(express.json())

//GET - 1-й url по которому мы можем получать данные
app.get('/api/contacts', (req, res) => {
    setTimeout(() => {
        res.status(200).json(CONTACTS)
    }, 1000)

})

// POST -чтобы создавать что-либо на сервере, когда заполняем в форме
app.post('/api/contacts', (req, res) => {
    const contact = {
            ...req.body,
            id: v4(),
            marked: false
        }
        //добавляем в базу данных контакт
    CONTACTS.push(contact)
        //статус 201 -элемент создан
    res.status(201).json(contact)

})



// DELETE -чтобы создавать что-либо на сервере, когда заполняем в форме
app.delete('/api/contacts/:id', (req, res) => {
    const idx = CONTACTS = CONTACTS.filter(c = c.id !== req.params.id)
    res.status(200).json({
        message: 'Контакт был удален'
    })
})

// PUT

app.put('/api/contacts/:id', (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id)
    CONTACTS[idx] = req.body
    res.json(CONTACTS[idx])
})






//код ниже дб внизу
//обозначим данную папку как статическую
//с помощье метода use добавляю новый медоу р, который находися в express и его методе static
//куда мне нужно передать путь файла кот нужно сделать статическим
app.use(express.static(path.resolve(__dirname, 'client')))

//когда я выполняю метод get по любым ройтам
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})


//можно запустить сервер вызвав метод listen у объекта app 
//первый параметр 3000 - порт на котором мы запустим приложение
//когда сервер загрузится - запуститься сообщение
app.listen(3000, () => console.log('Server has been srarted on port 3000...'))