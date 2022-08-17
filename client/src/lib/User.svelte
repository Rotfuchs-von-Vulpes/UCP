<script lang="ts">
	export let logout: () => void;
	export let user;
</script>

<h2>Área do usuário</h2>

Nome de usuário: {user.nick}<br>
Nome: {user.name}<br>
E-Mail: {user.mail}<br>

<button on:click="{logout}">Log out</button>
