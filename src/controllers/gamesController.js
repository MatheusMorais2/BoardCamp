import connection from "../database.js";

export async function createGame( req, res ) {
    const { name, image, stockTotal, categoryId, pricePerDay} = req.body;

    console.log('chegou no create games aqui');

    try {
        let gameDB = await connection.query(
            'select * from games where name=$1', [name]
        );
        if (gameDB.rows.length > 0 ) {
            return res.sendStatus(409);
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
    console.log('chegou no getGames');

    try {
        const gamesList = await connection.query(
            `select games.*, categories.name as "categorieName" from games
            join categories on games."categoryId"=categories.id`
        );

        console.log(gamesList);
        res.status(200).send(gamesList.rows);
    } catch {
        res.sendStatus(500);
    }
}