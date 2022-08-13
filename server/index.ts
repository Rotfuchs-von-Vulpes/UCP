import express from 'express';
import { Request, Response } from 'express';
import sha256 from 'sha256';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

let port = 3000;

app.use(cors());
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

	console.log(user)

	prisma.authme
		.findUnique({ where: { Usuario: user.nick }})
		.then(async (userValue) => {
			if (userValue) {
				res.send({
					success: false,
					message: 'Esse nome de usuário já esta cadastrado.',
				});
			} else {
				user.password = sha256(user.password);
				console.log(user);

				await prisma.authme.create({ data: {
					Usuario: user.nick,
					NomeReal: user.name,
					Senha: user.password,
					Email: user.email
				}});

				res.send({
					success: true,
					message: 'Registrado com sucesso',
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

app.post('/login', (req: Request, res: Response) => {
	let data = req.body;

	prisma.authme
		.findUnique({ where: { Usuario: data.nick } })
		.then((userValue) => {
			if (userValue) {
				if (sha256(data.password) == userValue?.Senha) {
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

