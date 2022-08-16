<script lang="ts">
	export let login: (nick: string, pass: string) => void;
	export let toRegister: () => void;

	let nick = '';
	let pass = '';

	function getValues() {
		login(nick, pass);
	}
</script>

Login<br>
<form>
	<input type="text" bind:value="{nick}" placeholder="Usuário"><br>
	<input type="text" bind:value="{pass}" placeholder="Senha">
</form>
<button on:click="{getValues}">Entrar</button><br>
<button on:click="{toRegister}">Registrar</button>

