import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
//Vue компонент loader - заглушка при загрузке
Vue.component('loader', {
    template: `
	 <div style="display: flex; justify-content: space-between;	 align-items: center">
	 <div class="spinner-border" role="status">
<span class="visually-hidden">Loading...</span>
</div>
</div>
`
})

//создаем новое приложение Vue
//какой элемент является корневым с помощью параметра el
//#app - селектор по кот Vue может получить данный элемент 
new Vue({
    el: '#app',
    //c помощью метода мы возвращаем объект кот явл моделями для нашего приложения
    data() {
        return {
            loading: false,
            form: {
                name: '',
                value: ''
            },
            contacts: []
        }
    },
    //чтобы нне создавался пустой сет
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim()
        }
    },

    methods: {
        async createContact() {
            const {
                ...contact
            } = this.form

            const newContact = await request('/api/contacts', 'POST', contact)
                // console.log(response)

            this.contacts.push(newContact)
                //this.contacts.push({  ...contact,     id: Date.now(),   marked: false                })
                //для очистки формы после ввода данных
            this.form.name = this.form.value = ''
        },
        async markContact(id) {
            //ищем текущий контакт
            const contact = this.contacts.find(c => c.id === id)
            const updated = await request(`/api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: true
            })

            contact.marked = updated.marked
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE')
                //удаление по кнопке
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
    },
    //вызывается когда компонент готов
    async mounted() {
        this.loading = true
            //ждем пока функция request выполнится
            //в скобкахпырвый api запрос
        this.contacts = await request('/api/contacts')
        this.loading = false
    }
})


async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            //тип контента - json
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn('Error:', e.message)
    }
}