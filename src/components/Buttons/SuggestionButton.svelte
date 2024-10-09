<script>
	export let onClick;
</script>

<div class="suggestion-button-container">
	<button class="suggestion-button" on:click={onClick}><slot /></button>
</div>

<style>
	.suggestion-button-container {
		margin-left: 5px;
		margin-right: 5px;
	}

	.suggestion-button {
		font-family: 'Poppins';
		font-size: 0.95em;
		color: white;
		background-color: #cc491a;
		border-style: none;
		border-radius: 10px;
		padding: 10px;
	}

	.suggestion-button:active {
		background-color: #a8350b;
	}
</style>
