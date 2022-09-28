export default class Item {
    constructor(data) {
        Object.assign(this, data)
    }
    
    getItemHtml() {
        const {uuid, image, title, description, price} = this
        
        return `
            <div class="item">
                <p class="item-image">${image}</p>
                <h2 class="item-title">${title}</h2>
                <p class="item-description">${description}</p>
                <p class="item-price">$${price}</p>
                <button class="item-btn" data-add=${uuid}>+</button>
            </div>
        `
    }
}
