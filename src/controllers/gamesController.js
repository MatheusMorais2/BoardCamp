import connection from "../database.js";

export async function createGame( req, res ) {
    const { name, image, stockTotal, categoryId, pricePerDay} = req.body;

    try {
        let gameDB = await connection.query(
            'select * from games where name=$1', [name]
        );
        if (gameDB.rows.length > 0 ) {
            return res.sendStatus(409);
        }

        let cateogoryIdDB = await connection.query(
            'select * from categories where id=$1', [categoryId]
        );
        if (cateogoryIdDB.rows.length === 0) {
            return res.sendStatus(400)
        }

        await connection.query(
            `insert into games (name, image, "stockTotal", "categoryId", "pricePerDay")
                values ($1, $2, $3, $4, $5)`, 
                [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}

export async function getGames (req, res) {
    const search = req.query.name;

    try {
        const gamesList = await connection.query(
            `select games.*, categories.name as "categoryName" from games
            join categories on games."categoryId"=categories.id
            ${search ? `where games.name like ${search}%` : ''}`
        )

        res.status(200).send(gamesList.rows);
    } catch {
        res.sendStatus(500);
    }
}