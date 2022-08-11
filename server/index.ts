import express from 'express';

import { Request, Response } from 'express';

import 'dotenv/config';
import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

let salt = bcrypt.genSaltSync(10);

let port = 3000;

// app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
	console.log(`servidor rodando na porta ${port}`);
});

app.get('/', (req: Request, res: Response) => {
	res.send('Conectado ao servidor');
});

// app.get('/databaseStatus', (req: Request, res: Response) => {
// 	res.send({ databaseStatus: databaseConnected });
// });

app.post('/register', (req: Request, res: Response) => {
	let user = req.body;

	prisma.user
		.findUnique({ where: { Email: user.email }})
		.then((userValue) => {
			if (userValue) {
				res.send({
					success: false,
					message: 'Esse email já esta cadastrado.',
				});
			} else {
				user.password = bcrypt.hashSync(user.password, salt);
				console.log(user);

				prisma.user.create({ data: {
					Usuario: user.nickname,
					NomeReal: user.name,
					Senha: user.password,
					Email: user.email
				}});
			}
		})
		.catch((err) => {
			console.error(err);

			res.send({
				success: false,
				message: 'Não estamos conseguindo se conectar ao banco de dados',
			});
		});
});

app.post('/login', (req: Request, res: Response) => {
	let data = req.body;

	prisma.user
		.findUnique({ where: { Email: data.email } })
		.then((userValue) => {
			if (userValue) {
				if (bcrypt.compareSync(data.password, userValue?.Senha)) {
					res.send({
						success: true,
						message: 'Logado com sucesso!',
						data: userValue?.Senha,
					});
				} else {
					res.send({
						success: false,
						message: 'Senha incorreta',
					});
				}
			} else {
				res.send({
					success: false,
					message: 'Usuário inexistente',
				});
			}
		})
		.catch((err) => {
			console.error(err);

			res.send({
				success: false,
				message: 'Não estamos conseguindo se conectar ao banco de dados',
			});
		});
});

