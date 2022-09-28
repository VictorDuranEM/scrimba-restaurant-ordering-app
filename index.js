import { menuArray } from './assets/data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import Item from './classes/Item.js'

let order = []
const items = createItems()
let orderCompleteName = ''
render()

document.addEventListener('click', (e) => {
    if (e.target.dataset.add) {
        handleAddToOrder(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveFromOrder(e.target.dataset.remove)
    } else if (e.target.id === 'order-btn') {
        handleCompleteOrder()
    } else if (e.target.id === 'modal-root') {
        dismissModal()
    }
})

const payForm = document.getElementById('modal-form')
payForm.addEventListener('submit', handlePay)

function createItems() {
    return menuArray.map(e => 
        new Item({
            uuid: uuidv4(),
            title: e.name,
            description: e.ingredients.join(','),
            price: e.price,
            image: e.emoji
        })
    )
}

function getItemsHtml() {
    return items.map(item => item.getItemHtml()).join('')
}

function getOrderHtml() {
    if (order.length > 0) {
        return `
            <h2 class="order-title">Your order</h1>
            <div class="order-items">
                ${order.map(item => 
                    `<div class="order-item">
                        <h2 class="order-item-title">${item.title}</h1>
                        <p class="order-item-remove" data-remove=${item.uuid}>remove</p>
                        <p class="order-item-price">$${item.price}</p>
                    </div>`  
                ).join('')}
            </div>
            <div class="order-total">
                <h2 class="order-total-title">Total price:</h2>
                <p class="order-total-price">$${calculateTotalPrice()}</p>
            </div>
            <button id="order-btn" class="order-btn">Complete order</button>
        `
    }
    return ''
}

function addThanksMessage() {
    if (orderCompleteName) {
        const thanksElement = document.getElementById('thanks')
        thanksElement.textContent = `Thanks, ${orderCompleteName}! Your order is on its way!`
        thanksElement.classList.remove('hidden')
        orderCompleteName = ''
    } else {
        document.getElementById('thanks').classList.add('hidden')
    }
}

function calculateTotalPrice() {
    return order.reduce((prev, next) => prev + next.price, 0)
}

function render() {
    document.getElementById('items').innerHTML = getItemsHtml()
    document.getElementById('order').innerHTML = getOrderHtml()
    addThanksMessage()
}

function handleAddToOrder(uuid) {
    const itemToAdd = items.find(item => item.uuid === uuid)
    if (!order.some(item => item.uuid === itemToAdd.uuid)) {
        order.push(itemToAdd)
    }
    render()
}

function handleRemoveFromOrder(uuid) {
    order = order.filter(item => item.uuid !== uuid)
    render()
}

function handleCompleteOrder() {
    document.getElementById('modal-root').classList.add('visible')
}

function dismissModal() {
    document.getElementById('modal-root').classList.remove('visible')
}

function handlePay(e) {
    e.preventDefault()
    const formData = new FormData(payForm)
    orderCompleteName = formData.get('name')
    order = []
    dismissModal()
    render()
}