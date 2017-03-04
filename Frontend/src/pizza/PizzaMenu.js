/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var $quantity = $("#quantity");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}


function filterPizza(filter) {

    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var count = 0;
    Pizza_List.forEach(function (pizza) {
        //Якщо піца відповідає фільтру
        if (pizza.filter.forEach(function (c) {
                if (c == filter) {
                    pizza_shown.push(pizza);
                    count++;
                }
            }));
    });
    $quantity.text(count);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

$("#veg-pizzas").click(function () {
    setActive(this);
    filterPizza('vega');
});
$("#pineapple-pizzas").click(function () {
    setActive(this);
    filterPizza('pineapple');
});
$("#mushroom-pizzas").click(function () {
    setActive(this);
    filterPizza('mushroom');
});
$("#sea-pizzas").click(function () {
    setActive(this);
    filterPizza('ocean');
});
$("#meat-pizzas").click(function () {
    setActive(this);
    filterPizza('meat');
});
$("#all-pizzas").click(function () {
    setActive(this);
    $quantity.text(9);
    initialiseMenu();
});

function setActive(id) {
    $('.menu-titles').children().each(function () {
        $(this).removeClass("active");
    });
    $(id).addClass("active");
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;