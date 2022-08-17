<script lang="ts">
	import axios from 'axios';

	import api from './lib/api';

	import Login from './lib/Login.svelte';
	import Register from './lib/Register.svelte';
	import User from './lib/User.svelte';

	let logged = localStorage.getItem('logged') === 'true';
	let user = {
		nick: localStorage.getItem('nick'),
		name: localStorage.getItem('name'),
		mail: localStorage.getItem('mail'),
		hash: localStorage.getItem('hash'),
	};
	

	let page: number;

	if (logged) {
		page = 2;
	} else {
		page = 0;
	}

	function toRegister() {
		page = 1;
	}

	function toLogin() {
		page = 0;
	}

	function register(nick, name, pass, mail) {
		let data = { nick, name, pass, mail };

		api
			.post('/register', data)
			.then((res: any) => {
				console.log(res.data);
				alert(res.data.message);
				if (res.data.success) {
					page = 2;

					user.nick = nick;
					user.name = name;
					user.mail = mail;
					user.hash = res.data.hash;

					localStorage.setItem('logged', 'true');
					localStorage.setItem('nick', user.nick);
					localStorage.setItem('name', user.name);
					localStorage.setItem('mail', user.mail);
					localStorage.setItem('hash', user.hash);
				}
			})
			.catch((err: any) => {
				console.error(err);
				alert('Algo deu errado...');
			});
	}

	function login(nick, pass) {
		let data = { nick, pass };
		api
			.post('/login', data)
			.then((res: any) => {
				console.log(res.data);
				alert(res.data.message);
				if (res.data.success) {
					page = 2;

					user.nick = nick;
					user.name = res.data.name;
					user.mail = res.data.mail;
					user.hash = res.data.hash;

					localStorage.setItem('logged', 'true');
					localStorage.setItem('nick', user.nick);
					localStorage.setItem('name', user.name);
					localStorage.setItem('mail', user.mail);
					localStorage.setItem('hash', user.hash);
				}
			})
			.catch((err: any) => {
				console.error(err);
				alert('Algo deu errado...');
			});
	}

	function logout() {
		api.post('/logout', { nick: user.nick }).then(() => {
			page = 0;

			user.nick = null;
			user.name = null;
			user.mail = null;
			user.hash = null;

			localStorage.setItem('logged', 'false');
			localStorage.setItem('nick', null);
			localStorage.setItem('name', null);
			localStorage.setItem('mail', null);
			localStorage.setItem('hash', null);
		});
	}
</script>

{#if page === 0}
	<Login {login} {toRegister} />
{:else if page === 1}
	<Register {register} {toLogin} />
{:else}
	<User {logout} {user} />
{/if}
