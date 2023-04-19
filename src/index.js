import bcrypt from 'bcrypt';
import cors from 'cors';
import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import db from './connection';
import UserModel from './models/user';

const router = Router();
const saltRounds = 10;
const mySecret = 'contraseña1235';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.listen(3000, () => console.log('Server on port 3000'));

app.use(router);

db().then(() => console.log('Database connected'));

router.post('/login', async (req, res) => {
	const { _id } = req.body;
	// res.send(_id);
	const response = await UserModel.findOne({ _id: _id });
	// res.send(response);
	if (response) {
		const token = jwt.sign(
			{
				_id: response._id,
			},
			mySecret,
			{
				expiresIn: 60 * 60 * 24,
			}
		);
		const decoded = jwt.verify(token, 'RaulEsUnPendejote');
		res.json({ token, decoded });
	} else {
		res.status(404).send('Si no funciona me corto la tula');
	}
});

router.post('/app/login', async (req, res) => {
	const { name, password } = req.body;

	const userLogin = await UserModel.findOne({ name });

	if (userLogin.length > 0) {
		userLogin.forEach((usuario) => {
			bcrypt.compare(password, usuario.pass, (err, isMatch) => {
				if (!isMatch) {
					res.status(401).json({ token: null, message: "pendejo 'ta mal" });
				} else {
					const token = jwt.sign({ name: usuario.name }, mySecret, {
						expiresIn: 86400,
					});
					res.json({ token });
				}
			});
		});
	}

	if (userLogin) {
		const token = jwt.sign(
			{
				name: userLogin.name,
				pass: userLogin.pass,
			},
			mySecret,
			{
				expiresIn: 60 * 60 * 24,
			}
		);
		const decoded = jwt.verify(token, 'RaulEsUnPendejote');
		res.json({ token, decoded });
	} else {
		res.status(400).send('Credenciales invalidas');
	}
});

router.get('/users', async (req, res) => {
	const response = await UserModel.find();
	res.send(response);
});

router.post('/registro', (req, res) => {
	const { _id, name, password } = req.body;
	console.log(req.body);

	bcrypt.hash(password, saltRounds, async (err, hash) => {
		const pass = hash;
		const data = { _id, name, pass };
		console.log(data);

		try {
			const user = await UserModel.create(data);
			res.send(user);
		} catch (err) {
			res.send('Adalid es un naco y estupido');
		}
	});
});
