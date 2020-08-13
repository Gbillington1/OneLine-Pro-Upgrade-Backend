class Customer {

    constructor(customer_id, customer_timestamp, customer_email, customer_first_name, customer_last_name, customer_invoice_prefix, customer_tax_exempt) {
        this.customer_id = customer_id;
        this.customer_timestamp = customer_timestamp;
        this.customer_email = customer_email;
        this.customer_first_name = customer_first_name;
        this.customer_last_name = customer_last_name;
        this.customer_invoice_prefix = customer_invoice_prefix;
        this.customer_tax_exempt = customer_tax_exempt;
    }

    insert(conn) {
        let customer = this;
        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO customers (customer_id, customer_timestamp, customer_email, customer_first_name, customer_last_name, customer_invoice_prefix, customer_tax_exempt) VALUES (?, ?, ?, ?, ?, ?, ?)', [customer.customer_id, customer.customer_timestamp, customer.customer_email, customer.customer_first_name, customer.customer_last_name, customer.customer_invoice_prefix, customer.customer_tax_exempt], function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

}