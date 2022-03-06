import connection from '../database.js';

export async function createCategory(req, res) {
    const { name } = req.body;

    try {
        let categoryDB = await connection.query(
            'select * from categories where name = $1', [name]
        );

        if (categoryDB.rows.length > 0) {
            res.sendStatus(409);
            return;
        }

        await connection.query(
            'insert into categories (name) values ($1)', [name]
        )

        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}

export async function getCategories(req, res) {
    try {
        let categories = await connection.query(
            'select * from categories'
        );

        res.status(200).send(categories.rows);
    } catch {
        res.sendStatus(500);
    }
}