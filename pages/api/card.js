import dbConnect from '../../db';
import Card from '../../models/creditCard';
export default async function handler(req, res) {
	const { method } = req;
	const { cardNumber, cvv, date, amount } = req.body;

	await dbConnect();
	switch (method) {
		case 'GET':
			res.status(200).json({ lol: 'lol' });
		case 'POST':
			let cardExists = await Card.findOne({ cardNumber });
			console.log(cardNumber);
			if (cardExists) {
				res.status(400);
				throw new Error('Карта существует');
			}
			const card = await Card.create({
				cardNumber: cardNumber,
				cvv: cvv,
				date: date,
				amount: amount,
			});
			if (card) {
				if (
					cardNumber.toString().replace(/\D/g, '').length === 16 &&
					cvv.toString().replace(/\D/g, '').length === 3 &&
					date.match(/[\d]{2}\/[\d]{4}/) &&
					amount
				) {
					res.status(201).json({
						RequestId: card._id,
						Amount: amount,
					});
				} else {
					res.status(401).json({
						message: 'Данные были введены неправильно',
					});
				}
			}
	}
}
