import connection from "../database.js";

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfDB = await connection.query('select * from customers where cpf=$1', [cpf]);
        if (cpfDB.rows.length > 0) {
            return res.sendStatus(409)
        }

        await connection.query(`
            insert into customers (name, phone, cpf, birthday)
            values ($1, $2, $3, $4)
            `, [name, phone, cpf, birthday]
        )

        return res.sendStatus(201);
    } catch {
        return res.sendStatus(500);
    }
}

export async function getCustomers(req, res) {

    let cpfSearch = '';
    console.log('query cof: ', req.query.cpf);

    if (req.query.cpf) {
        cpfSearch = ` where cpf like ${req.query.cpf}% `;
    } 

    try {
        const search = await connection.query(
            `select * from customers ${cpfSearch}`
        );
        
        return res.send(search.rows).status(200)
    } catch {
        return res.sendStatus(500);
    }
}

export async function getCustomersbyId (req, res) {
    let id = req.params.id;

    try {
        const search = await connection.query('select * from customers where id=$1', [id]);

        if ( search.rows.length === 0) return res.sendStatus(404);

        res.send(search.rows).status(200)
    } catch {
        return res.sendStatus(500);
    }
}

export async function updateCustomer (req, res) {
    const { name, phone, cpf, email } = req.body;
    const id = req.query.id;

    try {

        const cpfDB = await connection.query('select * from customers where cpf=$1', [cpf]);
        if (cpfDB.rows.length > 0) {
            return res.sendStatus(409)
        }

        await connection.query(`
            update customers 
            set 
                name=$1,
                phone=$2,
                cpf=$3,
                birthday=$4
            where id=$5 
        `, [name, phone, cpf, email, id])
    } catch {
        return res.sendStatus(500);
    }
}