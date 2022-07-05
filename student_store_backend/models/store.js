const db = require("../db")

class Store {

    static async listProducts() {
        const results = db.query (`
        SELECT
        name,
        category,
        image,
        description
        price
        FROM products
        ORDER BY id ASC;
        `)

        return results.rows
    }

}

module.exports = Store