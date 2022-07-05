const db = require("../db")

class Order {

    static async listOrdersForUser(user) {
        //Return all orders that the authenticated user has created
        const results = await db.query(`
        SELECT
        o.id AS "orderId",
        o.customer_id AS "customerId",
        od.quantity AS "quantity",
        p.name AS "name",
        p.price AS "price"
        FROM orders AS o
        JOIN order_details AS od ON o.id = od.order_id
        JOIN products AS p ON p.id = od.product_id 
        WHERE o.customer_id = (SELECT id FROM users WHERE email = $1);
        `, [user.email])

        return results.rows

    }

    static async createOrder({ user, order }) {
        //Take a user's order and store it in the database

        //Insert order into orders table and get id
        const results = await db.query(`
        INSERT INTO orders(
            customer_id)
        VALUES((SELECT id FROM users WHERE email = $1))
        RETURNING id;
        `, [user.email])

        const orderId = results.rows[0]

        //Make new row in order_details for each item ordered
        order.forEach(item => {
            db.query(`
            INSERT INTO order_details(
                order_id,
                product_id,
                quantity)
            VALUES($1, $2, $3);
            `, [orderId, item.productId, item.quantity])
        })
    }

}

module.exports = Order