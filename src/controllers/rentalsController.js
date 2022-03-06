import connection from "../database.js";
import dayjs from 'dayjs';

export async function createRental(req, res) {
    const { customerId, gameId, daysRented} = req.body;

    const dateNow = dayjs().format('YYYY-MM-DD');
    let returnDate = null;
    let delayFee = null;

    try {

        const customerDB = await connection.query('select * from customers where id=$1', [customerId]);
        if (customerDB.rows.length === 0) return res.send('User not found').status(400);

        let originalPrice = null;

        const gameDB = await connection.query('select * from games where id=$1', [gameId]);
        if (gameDB.rows.length === 0) {
            return res.send('Game not found').status(400)
        } else {
            originalPrice = gameDB.rows[0].pricePerDay
        }

        await connection.query(
            `insert into rentals
                (customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee)
                values ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, dateNow, daysRented, returnDate, originalPrice, delayFee]
        )


    } catch {
        return res.sendStatus(500);
    }
}