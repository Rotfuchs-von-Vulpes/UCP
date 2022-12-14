import express from 'express';
import { Request, Response } from 'express';
import sha256 from 'sha256';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const app = express();

let port = 3000;

let connectedUsers: Map<string, string> = new Map();

function login(nick: string) {
	const buf = Buffer.alloc(10);
	const hash = crypto.randomFillSync(buf).toString('hex');

	console.log(hash);
	connectedUsers.set(nick, hash);

	return hash;
}

function logout(nick: string) {
	connectedUsers.delete(nick);
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
	console.log(`servidor rodando na porta ${port}`);
});

app.get('/', (req: Request, res: Response) => {
	res.send('Conectado ao servidor');
});

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
				user.pass = sha256(user.pass);
				console.log(user);

				await prisma.authme.create({ data: {
					Usuario: user.nick,
					Senha: user.pass,
					Email: user.mail
				}}).then(() => {
					let hash = login(user.nick);

					res.send({
						success: true,
						message: 'Registrado com sucesso',
						hash
					});
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
				if (sha256(data.pass) == userValue?.Senha) {
					const hash = login(data.nick);

					res.send({
						success: true,
						message: 'Logado com sucesso!',
						mail: userValue.Email,
						hash,
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

app.post('/logout', (req: Request, res: Response) => {
	let data = req.body;

	logout(data.nick);

	res.send({
		success: true,
	})
})
