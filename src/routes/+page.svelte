<script>
	import AnalysisPanel from '../components/AnalysisPanel/AnalysisPanel.svelte';

	let data = $state(null);
	let loading = $state(true);
	let error = $state(null);

	$effect(async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}`);

			if (!response.ok) {
				throw new Error('Received invalid response.');
			}

			const rawData = await response.json();

			if (!rawData.nodes) {
				throw new Error('Invalid data.');
			}

			data = rawData.nodes;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Workflow Visualizer</title>
	<meta name="description" content="Workflow visualizer." />
</svelte:head>

<section>
	<div class="title-container">
		<h1 class="title">Workflow Analysis</h1>
	</div>

	{#if loading}
		<div class="placeholder-label">Loading...</div>
	{:else if !data || error}
		<div class="placeholder-label">Unable to load data.</div>
	{:else}
		<AnalysisPanel {data} />
	{/if}
</section>

<style>
	.title-container {
		margin-bottom: 15px;
	}
	.title {
		width: 100%;
		font-family: 'EB Garamond';
		font-weight: '800';
		font-style: 'bold';
		font-size: 3em;
	}

	.placeholder-label {
		display: flex;
		flex-grow: 1;
		margin-top: 15%;
		align-items: start;
		justify-content: center;
		font-family: 'EB Garamond';
		font-size: 1.5em;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		flex: 1;
	}
</style>
