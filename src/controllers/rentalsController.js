import connection from "../database.js";
import dayjs from 'dayjs';
import SqlString from 'sqlstring';

export async function createRental(req, res) {

    const { customerId, gameId, daysRented} = req.body;

    const dateNow = dayjs().format('YYYY-MM-DD');
    let returnDate = null;
    let delayFee = null;

    try {

        const customerDB = await connection.query('select * from customers where id=$1', [customerId]);
        if (customerDB.rows.length === 0) return res.send('User not found').status(400);

        const gameDB = await connection.query('select * from games where id=$1', [gameId]);
        if (gameDB.rows.length === 0) return res.send('Game not found').status(400);

        let pricePerDay = gameDB.rows[0].pricePerDay;
        let originalPrice = parseInt(daysRented) * parseInt(pricePerDay);
    
        const gamesRented = await connection.query('select * from rentals where "gameId" = $1', [gameId]);

        if (gamesRented.rows.length >= parseInt(gameDB.rows[0].stockTotal)) return res.send('Game not in stock').status(400);

        await connection.query(
            `insert into rentals
                ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                values ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, dateNow, daysRented, returnDate, originalPrice, delayFee]
        );

        res.sendStatus(201)

    } catch {
        return res.sendStatus(500);
    }
}

export async function getRentals (req, res) {
    let gameQuery = '';
    if (req.query.gameId) gameQuery = `where "gameId" = ${SqlString.escape(req.query.gameId)} `

    let customerQuery = '';
    if (req.query.customerId) customerQuery = `where "customerId" = ${SqlString.escape(req.query.customerId)} `

    try {

        const search = await connection.query(
            {text: `select 
                    rentals.*, 
                    customers.id as "customerId", customers.name as "customerName", 
                    games.id as "gameId", games.name as "gameName", games."categoryId",
                    categories.id as "categoryId" ,categories.name as "categoryName"
                from rentals
                join games on games.id = rentals."gameId"
                join customers on customers.id = rentals."customerId"
                join categories on categories.id = games."categoryId"
                ${gameQuery}
                ${customerQuery}
            `, rowMode: 'array'});

        return res.send(search.rows.map( row => {
            const [id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, customerName, gameName, cateogoryId, categoryName] = row;
            return { id,
                 customerId,
                  gameId,
                   rentDate,
                    daysRented,
                     returnDate,
                      originalPrice,
                       delayFee,
                        customer: {id: customerId, name: customerName},
                         game: {id: gameId, name: gameName, cateogoryId, categoryName}}
        })).status(200);

    } catch {
        return res.sendStatus(500);
    }

}

export async function deleteRental (req, res) {
    const rentalId = req.params.id;

    try {
        const rentalDB = await connection.query('select * from rentals where id=$1', [rentalId])
        if (rentalDB.rows.length === 0) return res.sendStatus(200)

        await connection.query('delete from rentals where id=$1', [rentalId]);

        return res.sendStatus(200);

    } catch {
        return res.sendStatus(500)
    }
}

export async function updateRental (req, res) {
    const rentalId = req.params.id
    const dateNow = dayjs().format('YYYY-MM-DD');
    let delayFee = 0;

    try {

        const rental = await connection.query('select * from rentals where id=$1', [rentalId]);

        if (rental.rows.length === 0) return res.send('Rental not found').status(404);

        const rentalInfo = rental.rows[0];

        if (rentalInfo.delayFee) return res.send('Rental already finished').status(400);

        if (dayjs().isAfter(rentalInfo.rentDate)) {
            const daysOverdue = dayjs().diff(rentalInfo.rentDate, 'day');
            delayFee = daysOverdue * (rentalInfo.originalPrice / rentalInfo.daysRented);
        }

        await connection.query(
            `update rentals 
            set
                "returnDate"=$1,
                "delayFee"=$2
            where id=$3
        `, [dateNow, delayFee, rentalId]);

        return res.sendStatus(200)
        
    } catch {
        return res.sendStatus(500)
    }
}