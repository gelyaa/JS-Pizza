/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage	= require('./LocalStorage/storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#orders-list");

// total order price
var total = $("#total-sum");

// quantity of orders
var order_quantity = $("#order-quantity");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    //Приклад реалізації, можна робити будь-яким іншим способом

    var t = 1;
    Cart.forEach(function(p){
        if(p.pizza === pizza && p.size === size) {
            t += p.quantity;
            removeFromCart(p);
        }
    });
        Cart.unshift({
            pizza: pizza,
            size: size,
            quantity: t
        });
        updateOrderQuantity(true);
        if (parseInt(order_quantity.html()) == 1) ordersMode();

       updateTotalPrice(pizza[size].price*t);
       //Оновити вміст кошика на сторінці
       updateCart();

}

$("#delete-order").click(function(){
    Cart = [];
    total.text(0);
    order_quantity.text(0);
    noOrdersMode();
    updateCart();
});

function removeFromCart(cart_item) {
    updateOrderQuantity(false);
    updateTotalPrice(cart_item.pizza[cart_item.size].price * cart_item.quantity * (-1));
    if(parseInt(order_quantity.html()) <= 0)
        noOrdersMode();
    Cart.splice(Cart.indexOf(cart_item),1);
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved_orders = Storage.get('cart');
    if(saved_orders) {
        var n = Storage.get('saved_quantity');
        if( n > 0){
            Cart = saved_orders;
            order_quantity.text(n);
            total.text(Storage.get('saved_total'));
            ordersMode();
        }
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateOrderQuantity(toAdd){
    var num = parseInt(order_quantity.html());
    if(toAdd) order_quantity.text(num + 1);
    else order_quantity.text(num - 1);
}

function updateTotalPrice(price){
    var num = parseInt(total.html());
    total.text(price + num);
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            updateTotalPrice(cart_item.pizza[cart_item.size].price);

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Уменьшаем кількість замовлених піц
            cart_item.quantity -= 1;
            if(cart_item.quantity < 1)
                removeFromCart(cart_item);

            updateTotalPrice(cart_item.pizza[cart_item.size].price * (-1));

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".remove").click(function(){
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    Storage.set("cart",	Cart);
    Storage.set( "saved_quantity", parseInt(order_quantity.html()) );
    Storage.set("saved_total",	parseInt(total.html()) );
    Cart.forEach(showOnePizzaInCart);

}

function noOrdersMode(){
    $(".right-panel").addClass("no-orders");
    $("#order-btn").attr("disabled", true);
}

function ordersMode(){
    $(".right-panel").removeClass("no-orders");
    $("#order-btn").attr("disabled", false);
}

function getTotalPrice(){
    return parseInt(total.html());
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.getTotalPrice = getTotalPrice;

exports.PizzaSize = PizzaSize;