<script>
	import AnalysisPanel from '../components/AnalysisPanel/AnalysisPanel.svelte';

	let data = $state(null);
	let loading = $state(true);
	let error = $state(null);

	$effect(async () => {
		try {
			const response = await fetch('http://localhost:8000/getAll');

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
		Loading...
	{:else if !data || error}
		Unable to load data.
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

	section {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		flex: 1;
	}
</style>
