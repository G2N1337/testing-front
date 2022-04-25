import React, { useState, useEffect } from 'react';

import './App.css';
import Box from '@mui/material/Card';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import { IMaskInput } from 'react-imask';

import axios from 'axios';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
	const { onChange, ...other } = props;
	return (
		<IMaskInput
			{...other}
			mask='##/####'
			definitions={{
				'#': /[1-9]/,
			}}
			inputRef={ref}
			onAccept={(value) => onChange({ target: { name: props.name, value } })}
			overwrite
		/>
	);
});

const CreditForm = () => {
	const [cardNumber, setCardNumber] = useState('');
	const [cvv, setCvv] = useState('');
	const [date, setDate] = useState('');
	const [error, setError] = useState(undefined);
	const [amount, setAmount] = useState();
	const [active, setActive] = useState(false);
	const [success, setSuccess] = useState('');
	useEffect(() => {
		if (
			cardNumber.length === 16 &&
			cvv.length === 3 &&
			date.match(/[\d]{2}\/[\d]{4}/) &&
			amount
		) {
			setActive(true);
		} else {
			setActive(false);
		}
	}, [cardNumber, cvv, date, amount]);
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				background: 'linear-gradient(45deg, blue, red)',
			}}
		>
			<Box variant='outlined'>
				<CardContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						bgcolor: 'background.paper',
						boxShadow: 1,
						borderRadius: 2,
						width: 650,
					}}
				>
					<FormControl>
						<InputLabel htmlFor='card-number'>Card Number</InputLabel>
						<Input
							sx={{
								boxShadow: '4px 16px 24px -7px rgba(0,0,0,0.2)',
							}}
							placeholder='XXXXXXXXXXXXXXXX'
							value={cardNumber}
							onChange={(e) => {
								console.log(e.target.value);
								setCardNumber(e.target.value.trim().replace(/\D/g, ''));
							}}
							inputProps={{
								maxLength: 16,
							}}
							id='card-number'
						/>
					</FormControl>
					<FormControl>
						<InputLabel htmlFor='cvv'>CVV</InputLabel>
						<Input
							sx={{
								boxShadow: '4px 16px 24px -7px rgba(0,0,0,0.2)',
							}}
							placeholder='XXX'
							value={cvv}
							onChange={(e) => {
								console.log(e.target.value);
								setCvv(e.target.value.trim().replace(/\D/g, ''));
							}}
							inputProps={{
								maxLength: 3,
							}}
							id='cvv'
						/>
					</FormControl>
					<FormControl>
						<InputLabel htmlFor='date'>Date</InputLabel>
						<Input
							inputComponent={TextMaskCustom}
							sx={{
								boxShadow: '4px 16px 24px -7px rgba(0,0,0,0.2)',
							}}
							placeholder='MM/YYYY'
							value={date}
							onChange={(e) => {
								console.log(e.target.value);
								setDate(e.target.value.replace(/[А-Яа-яA-Za-z]/g, ''));
							}}
							inputProps={{
								maxLength: 7,
							}}
							id='date'
						/>
					</FormControl>

					<FormControl>
						<InputLabel htmlFor='amount'>Amount</InputLabel>
						<Input
							sx={{
								boxShadow: '4px 16px 24px -7px rgba(0,0,0,0.2)',
							}}
							value={amount}
							onChange={(e) => {
								console.log(e.target.value);
								setAmount(e.target.value.trim().replace(/\D/g, ''));
							}}
							inputProps={{}}
							id='amount'
						/>
					</FormControl>
					<Button
						disabled={!active}
						className='SubmitButton'
						type='submit'
						variant='contained'
						onClick={() => {
							if (cardNumber && cardNumber.length < 16) {
								setError('Длина карты должна быть длиной в 16 цифр');
							}
							if (cvv && cvv.length < 3) {
								setError('CVV код должен быть длиной в 3 цифры');
							}
							if (date && !date.match(/[\d]{2}\/[\d]{4}/)) {
								setError('Дата набрана неправильно');
							}
							if (amount <= 0) {
								setError('Amount пуст');
							}
							if (
								cardNumber.length === 16 &&
								cvv.length === 3 &&
								date.match(/[\d]{2}\/[\d]{4}/) &&
								amount > 0
							) {
								console.log('success');
								setError(undefined);
								axios
									.post('http://localhost:5000/cards/create', {
										cardNumber: cardNumber,
										cvv: cvv,
										date: date,
										amount: amount,
									})
									.then(function (response) {
										console.log(response);
										setSuccess(response.data);
										setError(false);
									})
									.catch(function (error) {
										console.log(error);
										setError('Ошибка');
									});
							}
						}}
					>
						Оплатить
					</Button>
					{success && (
						<Alert variant='filled'>
							Запрос был успешно отправлен! Данные: RequestId:
							{success.RequestId} Amount: {success.Amount}
						</Alert>
					)}
					{error && <Alert severity='error'>{error}</Alert>}
				</CardContent>
			</Box>
		</Box>
	);
};

export default CreditForm;
