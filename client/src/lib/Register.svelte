<script lang="ts">
	export let register: (nick: string, name: string, pass: string, mail: string) => void;
	export let toLogin: () => void;

	
	// Usuario: user.nick,
	// NomeReal: user.name,
	// Senha: user.password,
	// Email: user.email

	let nick = '';
	let name = '';
	let pass = '';
	let pas2 = '';
	let mail = '';

	function getValues() {
		if (pass === pas2) {
			register(nick, name, pass, mail);
		} else {
			alert('As senhas são diferentes!')
		}
	}
</script>

Login<br>
<form>
	<input type="text" bind:value="{nick}" placeholder="Usuário"><br>
	<input type="text" bind:value="{name}" placeholder="Nome"><br>
	<input type="text" bind:value="{pass}" placeholder="Senha"><br>
	<input type="text" bind:value="{pas2}" placeholder="Repita a senha"><br>
	<input type="text" bind:value="{mail}" placeholder="E-mail">
</form>
<button on:click="{getValues}">Registrar</button><br>
<button on:click="{toLogin}">Entrar</button>
