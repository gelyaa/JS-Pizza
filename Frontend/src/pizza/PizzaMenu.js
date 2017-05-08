/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
var Api = require('../API');

//HTML елемент куди будуть додаватися піци
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
$("#all-pizzas,.pizza-href").click(function () {
    setActive("#all-pizzas");
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

$("#order-btn").click(function () {
    document.location.href = "order.html";
});

$("#edit-btn").click(function () {
    document.location.href = "index.html";

});

$("#submit-btn").click(function () {
    validateName($('#name'));
    validatePhone($('#phone'));
    validateAddress($('#address'));
    if (isOk()) {
        Api.createOrder(description(), function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                LiqPayCheckout.init({
                    data: "Дані...",
                    signature: "Підпис...",
                    embedTo: "#liqpay",
                    mode: "popup" // embed || popup
                }).on("liqpay.callback", function (data) {
                    console.log(data.status);
                    console.log(data);
                }).on("liqpay.ready", function (data) { // ready
                }).on("liqpay.close", function (data) { // close
                });
                console.log("Order is sent to server");
            }
        })
    }
});

$('#name').keyup(function () {
    validateName($(this));
});

$('#address').keyup(function () {
    validateAddress($(this));
});

$('#phone').keyup(function () {
    validatePhone($(this));
});

function validateName(input) {
    var text = input.val();
    if (text.length < 2 || !(/^[a-zA-Zа-яА-Я\u0454\u0456\u0404]+$/.test(text))) {
        input.closest('.form-group').addClass('has-error');
        input.closest('.form-group').removeClass('has-success');
        $('#name-error').show();
    } else {
        input.closest('.form-group').addClass('has-success');
        input.closest('.form-group').removeClass('has-error');
        $('#name-error').hide();
    }
}

function validateAddress(input) {
    var text = input.val();
    if (text.length < 3) {
        input.closest('.form-group').addClass('has-error');
        input.closest('.form-group').removeClass('has-success');
        $('#ad-error').show();
    } else {
        input.closest('.form-group').addClass('has-success');
        input.closest('.form-group').removeClass('has-error');
        $('#ad-error').hide();
    }
}


function validatePhone(input) {
    var text = input.val();
    if (!( text.charAt(0) == 0 && text.length == 10) && !( text.substring(0, 4) == '+380' && text.length == 12)) {
        input.closest('.form-group').addClass('has-error');
        input.closest('.form-group').removeClass('has-success');
        $('#ph-error').show();
    } else {
        input.closest('.form-group').addClass('has-success');
        input.closest('.form-group').removeClass('has-error');
        $('#ph-error').hide();
    }
}

// address name and phone
function isOk() {
    return ($('#name-form').hasClass('has-success')
    && $('#phone-form').hasClass('has-success')
    && $('#address-form').hasClass('has-success'))
}

function description() {
    return {
        pizzas: PizzaCart.getPizzaInCart(),
        name: $("#name").val(),
        phone: $("#phone").val(),
        address: $("#address").val()
    };
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;