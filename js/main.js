const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     // window.ActiveXObject -> xhr = new ActiveXObject()
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === 4){
//             if(xhr.status !== 200){
//                 console.log('Error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     };
//     xhr.send();
// };

class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];//массив товаров из JSON документа
        this._getProducts()
            .then(data => { //data - объект js
                 this.goods = data;
                // console.log(data);
                 this.render()
            });
        
    }
    // _fetchProducts(cb){
    //     getRequest(`${API}/catalogData.json`, (data) => {
    //         this.goods = JSON.parse(data);
    //         console.log(this.goods);
    //         cb();
    //     })
    // }
    _getProducts(){
      
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
       
    }
    calcSum(){
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }

    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
//            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }

    }
}


class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>Цена: ${this.price} $</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
    }
}


class Basket {
    constructor(modalSelector = '.modal__body', containerSelector = '.products') {
        this.modalBodyBasket = modalSelector;
        this.containerSelector = containerSelector;
        this.basketGoods = [];//массив товаров корзины
        this.emptyBasket = '<strong>В корзине товаров нет.</strong>';
        this._getBasketGoods()
            .then(data => {
                this.basketGoods = data;
                this.renderBasket()
            });
        this.removeItemFromBasket();
        this.addItemToBasket();
        this.decrementItemInBasket();
        this.incrementItemInBasket();
    }

    

    _getBasketGoods() {
        return fetch(`${API}/getBasket.json`)
                .then(data => data.json())
                .catch( error => {
                    console.log(error);
                });
    }

    renderBasket() {
        const modalBody = document.querySelector(this.modalBodyBasket);
        modalBody.innerHTML = "";
        if(this.basketGoods.contents.length <= 0) {
            modalBody.insertAdjacentHTML('beforeend', this.emptyBasket);
        }
        for (let product of this.basketGoods.contents){
            const productInBasket = new BasketItem(product);
            modalBody.insertAdjacentHTML('beforeend', productInBasket.render());
        }
    }

    addItemToBasket() {
        const containerGoods = document.querySelector(this.containerSelector);
        containerGoods.addEventListener('click', (e) => {
            const target = e.target;
            if(target.classList.contains('buy-btn')) {
                const productEl = target.closest('.product-item')
                const id = +productEl.dataset.id;
                const img = productEl.querySelector('img').src;
                const title = productEl.querySelector('h3').textContent;
                // const price = +productEl.querySelector('p').textContent.replace(/[a-zа-яёА-Я]+:|\$+/g, '');
                const price = +productEl.querySelector('p').textContent.replace(/\D+/g, '');
                const count = 1;

                const index = this.basketGoods.contents.findIndex(item => item.id_product === id);

                if (this.basketGoods.contents[index]?.id_product === id) {
                    this.basketGoods.contents[index].quantity += 1;
                    this.basketGoods.contents[index].totalPrice = this.basketGoods.contents[index].price * this.basketGoods.contents[index].quantity;
                    this.renderBasket()
                } else {
                    this.basketGoods.contents.push({
                        id_product: id,
                        img: img,
                        product_name: title,
                        price: price,
                        quantity: count,
                    });
                    this.renderBasket()
                }
            }
        });
    }

    removeItemFromBasket() {
        const bodyContainer = document.querySelector(this.modalBodyBasket);
        bodyContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('remove-btn')) {
                const productid = +target.closest('.product-item').dataset.id;
                const index = this.basketGoods.contents.findIndex(item => item.id_product === productid);
                this.basketGoods.contents.splice(index, 1);
                this.renderBasket();
            }
        });
    }

    incrementItemInBasket() {
        const bodyContainer = document.querySelector(this.modalBodyBasket);
        bodyContainer.addEventListener('click', (e) => {
            const target = e.target;
            const productid = +target.closest('.product-item').dataset.id;
            if (!target.classList.contains('increment')) {
                return;
            }

            const index = this.basketGoods.contents.findIndex(item => item.id_product === productid);
            if (this.basketGoods.contents[index]?.id_product) {
                this.basketGoods.contents[index].quantity += 1;
                this.basketGoods.contents[index].totalPrice = this.basketGoods.contents[index].price * this.basketGoods.contents[index].quantity;
                this.renderBasket()
            }
        });
    }

    decrementItemInBasket() {
        const bodyContainer = document.querySelector(this.modalBodyBasket);
        bodyContainer.addEventListener('click', (e) => {
            const target = e.target;
            const productid = +target.closest('.product-item').dataset.id;
            
            if (!target.classList.contains('decrement')) {
                return;
            }
            const index = this.basketGoods.contents.findIndex(item => item.id_product === productid);
            if (this.basketGoods.contents[index]?.id_product === productid && this.basketGoods.contents[index]?.quantity > 1) {
                this.basketGoods.contents[index].quantity -= 1;
                this.basketGoods.contents[index].totalPrice = this.basketGoods.contents[index].price * this.basketGoods.contents[index].quantity;
                this.renderBasket()
            } else {
                this.basketGoods.contents.splice(index, 1);
                this.renderBasket()
            }
        });
    }

    _getBasketGoodsList() {
        return this.basketGoods.contents;
    }
}

class BasketItem {
    constructor(product, img = 'https://via.placeholder.com/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
        this.count = product.quantity;
        this.totalPrice = product.totalPrice || product.price;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}" ${this.count ? `data-count="${this.count}"` : ""}>
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.totalPrice} $</p>
                    <button class="remove-btn">Удалить</button>
                    <div class="count">
                        <span class="decrement">–</span>
                        <span class="count__total">${this.count}</span>
                        <span class="increment">+</span>
                    </div>
                </div>
            </div>`
    }
}
let list = new ProductsList();
let basket = new Basket();
// basket.removeItemFromBasket();
// console.log(list.allProducts);

