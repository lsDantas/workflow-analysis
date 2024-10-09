<script>
	import { onMount, setContext } from 'svelte';
	import cytoscape from 'cytoscape';
	import dagre from 'cytoscape-dagre';
	import graphStyles from './graphStyles.js';

	import Node from './Node.svelte';
	import Edge from './Edge.svelte';

	let { nodes, edges } = $props();

	let refElement = null;
	let cyInstance = $state(null);

	setContext('graphSharedState', {
		getCyInstance: () => cyInstance
	});

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
	});
</script>

<div class="graph" bind:this={refElement}>
	{#if cyInstance}
		<div class="heading">Directed Acyclic Graph Visualization</div>

		{#each nodes as node}
			<Node {node} />
		{/each}

		{#each edges as edge}
			<Edge {edge} />
		{/each}
	{/if}
</div>

<style>
	.graph {
		width: 100vw;
		height: 75vh;
		max-height: 100%;
	}

	.heading {
		font-family: 'EB Garamond';
		font-size: 1.8em;
		display: flex;
		justify-content: center;
	}
</style>
