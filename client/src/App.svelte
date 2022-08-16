<script lang="ts">
	import api from './api';

	// We import our page components (similar to the one above).
	import Login from './lib/Login.svelte';
	import Register from './lib/Register.svelte';
	import User from './lib/User.svelte';

	// The current page of our form.
	let page = 0;

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
        alert(res.data.message)
        if (res.data.success) page = 2;
			})
			.catch((err: any) => {
				console.error(err);
				alert('Algo deu errado...');
			});
	}

  function login(nick, pass) {
    let data = { nick, pass }
    api
      .post('/login', data)
      .then((res: any) => {
        console.log(res.data);
        alert(res.data.message);
        if (res.data.success) page = 2;
      })
      .catch((err: any) => {
        console.error(err);
        alert('Algo deu errado...');
      });
  }

  function logout() {
    page = 0;
  }
</script>

{#if page === 0}
	<Login {login} {toRegister} />
{:else if page === 1}
	<Register {register} {toLogin} />
{:else}
	<User {logout} />
{/if}
