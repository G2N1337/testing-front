import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const cardSchema = new Schema(
	{
		cardNumber: {
			type: Number,
			required: true,
		},
		cvv: {
			type: Number,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
mongoose.models = {};

var Card = mongoose.model('Card', cardSchema);
export default Card;
