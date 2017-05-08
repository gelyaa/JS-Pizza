/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List'),
    LIQPAY_PUBLIC_KEY = "i64748828428",
    LIQPAY_PRIVATE_KEY = "2e1z1eaLL87mDR7nxrFSpMujDrE3p7JfstaJGzIF";

exports.getPizzaList = function (req, res) {
    res.send(Pizza_List);
};

function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.createOrder = function (req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.price,
        currency: "UAH",
        description: getDescription(order_info),
        order_id: Math.random(),
        sandbox: 1
    };

    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

    res.send({
        success: true,
        data: data,
        signature: signature
    });

};

function getDescription(order) {
    var res = "Замовлення піци: " + order.name + "\n" + "Адреса доставки: " + order.address +
        "\n" + "Телефон: " + order.phone + "\n" + "Замовлення: ";
    order.pizzas.forEach(function (pizza) {
        res += pizza.pizza.title;
        if (pizza.size == "big_size") res += "(велика)" + "\n";
        else res += "(маленька)" + "\n";
    });
    res += "Разом: " + order.price;
    return res;
}







