<script>
	import { onMount, setContext } from 'svelte';
	import cytoscape from 'cytoscape';
	import dagre from 'cytoscape-dagre';
	import graphStyles from './graphStyles.js';

	import Node from './Node.svelte';
	import Edge from './Edge.svelte';

	let { nodes, edges, retrieveNode } = $props();

	let refElement = null;
	let cyInstance = $state(null);
	let highlightedNode = $state(null);
	let showInformationBar = $state(false);

	setContext('graphSharedState', {
		getCyInstance: () => cyInstance
	});

	// Node Click
	const onNodeClick = (evt) => {
		const clickProperties = evt.target._private;

		if (clickProperties?.group && clickProperties.group === 'nodes') {
			const { label } = evt.target._private.data;

			const node = retrieveNode(label.toLowerCase());

			highlightedNode = node;
			showInformationBar = true;
		} else {
			showInformationBar = false;
		}
	};

	onMount(() => {
		cytoscape.use(dagre);

		cyInstance = cytoscape({
			container: refElement,
			style: graphStyles,
			userZoomingEnabled: false
		});

		cyInstance.on('add', () => {
			cyInstance
				.makeLayout({
					name: 'dagre',
					rankDir: 'LR',
					nodeSep: 175
				})
				.run();
		});

		cyInstance.on('tap', onNodeClick);
	});
</script>

<div class="graph-container" bind:this={refElement}>
	{#if cyInstance}
		<div class="graph">
			{#each nodes as node}
				<Node {node} />
			{/each}

			{#each edges as edge}
				<Edge {edge} />
			{/each}
		</div>
	{/if}
</div>

{#if showInformationBar}
	<div class="info-card">
		<div class="info-card-title">Node Information</div>
		<div class="info-card-entry">
			<b>Name:</b>
			{highlightedNode.name}
		</div>
		<div class="info-card-entry">
			<b>Type:</b>
			{highlightedNode.type}
		</div>
		<div class="info-card-entry">
			<b>ID:</b>
			{highlightedNode.id}
		</div>
		<div class="info-card-entry">
			<b>Tags: </b>{Object.values(highlightedNode.tags)}
		</div>
	</div>
{/if}

<style>
	.graph-container {
		flex: 1;
		flex-direction: row;
		height: 75vh;
		min-width: 100vh;
		max-width: 100%;
		max-height: 100%;
	}

	.info-card {
		background: #fae4d1;
		box-shadow: 1px 1px 4px 0px #999999;
		border-radius: 0.25rem;
		min-height: 50vh;
		padding: 40px;
		margin-right: 50px;
	}

	.info-card-title {
		font-family: 'EB Garamond';
		font-size: 1.8em;
		margin-bottom: 20px;
	}

	.info-card-entry {
		padding: 2px;
	}
</style>
