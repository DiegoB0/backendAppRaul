import bcrypt from 'bcrypt';
import cors from 'cors';
import express, { Router } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { Server as WebSocketServer } from 'socket.io';
import db from './connection';
import LoginModel from './models/login';
import UserModel from './models/user';

const SOCKETSPORT = 3001;
const router = Router();
const saltRounds = 10;
const mySecret = 'contraseña1235';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.listen(3000, () => console.log('Server on port 3000'));

//Sockets settings
const server = http.createServer(app);
export const io = new WebSocketServer(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', () => {
	console.log('New user');
});

server.listen(SOCKETSPORT, () =>
	console.log(`SocketServer on port ${SOCKETSPORT}`)
);

app.use(router);

db().then(() => console.log('Database connected'));

router.post('/login', async (req, res) => {
	const { _id } = req.body;

	const loginData = await UserModel.findOne({ _id: _id });
	try {
		if (loginData) {
			const token = jwt.sign(
				{
					_id: loginData._id,
				},
				mySecret,
				{
					expiresIn: 60 * 60 * 24,
				}
			);
			const decoded = jwt.verify(token, mySecret);
			res.json({ token, decoded });

			io.emit('data', {
				body: token,
				decoded,
			});

			const noserie = loginData._id;
			const name = loginData.name;

			const data = { noserie, name };
			console.log(data);
			const login = await LoginModel.create(data);
			if (login) {
				res.send({ login });
			}
		} else {
			res.status(404).send('Si no funciona me corto la tula');
		}
	} catch (err) {
		console.log('Nao Nao');
	}
});

router.post('/app/login', async (req, res) => {
	const { name, password } = req.body;
	try {
		const userLogin = await UserModel.findOne({ name });

		if (userLogin.length > 0) {
			userLogin.forEach((usuario) => {
				bcrypt.compare(password, usuario.pass, (err, isMatch) => {
					if (!isMatch) {
						res
							.status(401)
							.json({ token: null, message: 'Contraseña invalida' });
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
			const decoded = jwt.verify(token, mySecret);
			res.json({ token, decoded });
		} else {
			res.status(400).send('Credenciales invalidas');
		}
	} catch (err) {
		res.status(404).send('No existe el usuario');
	}
});

router.get('/users', async (req, res) => {
	const response = await UserModel.find();
	res.send(response);
});

router.get('/logins', async (req, res) => {
	const response = await LoginModel.find();
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
