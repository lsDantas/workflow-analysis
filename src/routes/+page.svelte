<script>
	import { keyBy } from 'lodash-es';

	import { generatePrefixTree, searchPrefixTree } from '../utils/prefixTree';

	import Graph from './Graph.svelte';
	import Node from './Node.svelte';
	import Edge from './Edge.svelte';

	const data = [
		{ id: 1, name: 'Aardvark', parents: [] },
		{ id: 2, name: 'Apple', parents: [] },
		{ id: 3, name: 'Be', parents: ['Aardvark', 'Apple'] },
		{ id: 4, name: 'Been', parents: ['Be'] },
		{ id: 5, name: 'Benevolent', parents: ['Be'] },
		{ id: 6, name: 'Bellic', parents: [] },
		{ id: 7, name: 'Belligerent', parents: ['Bellic'] },
		{ id: 8, name: 'Bellicose', parents: ['Bellic'] },
		{ id: 9, name: 'Bespoke', parents: ['Bellic', 'Be'] }
	];

	const processedData = data.map((entry) => ({
		...entry,
		reference: entry.name.toLowerCase(),
		parents: entry.parents.map((parent) => parent.toLowerCase()),
	}));

	const workflowsDict = keyBy(processedData, 'reference');
	const retrieveNodeByName = (reference) => workflowsDict[reference];

	// Graph utilities
	const retrieveUpstreamNodes = (nodeName, retrieveNode) => {
		const node = retrieveNode(nodeName);

		const upstreamNodes = node.parents.map((parent) => retrieveUpstreamNodes(parent, retrieveNode));

		return [node, ...upstreamNodes];
	};

	// Formal graph definition for visualization
	const generateGraphData = (nodeData, retrieveNode) => {
		const nodes = nodeData.map((entry) => ({id: `N${entry.id}`, label: entry.name }));

		const edges = nodeData.reduce((currentEdges, entry) => {
			const newEdges = entry.parents.map((parentName) => {
				const parentNode = retrieveNode(parentName);

				const newEdge = {
					id: `E${parentNode.id}-${entry.id}`,
					source: `N${parentNode.id}`,
					target: `N${entry.id}`,
				};

				return newEdge;
			});
			return [...currentEdges, ...newEdges];
		}, []);

		return [nodes, edges];
	};

	const [nodes, edges] = generateGraphData(processedData, retrieveNodeByName);

	// Search feature
	const workflowNames = Object.keys(workflowsDict);
	const prefixTree = generatePrefixTree(workflowNames);

	let searchTerm = $state("");
	let searchResults = $derived.by(() => {
		const results = searchTerm !== ""
			? searchPrefixTree(searchTerm, prefixTree)
			: [];
		
		return results;
	});
</script>

<svelte:head>
	<title>Workflow Visualizer</title>
	<meta name="description" content="Workflow visualizer." />
</svelte:head>

<section>
	<h1 class="title">Workflow Analysis</h1>
	<br>
	<br>
	<br>
	<input bind:value={searchTerm}>
	{searchTerm}
	{#each searchResults as result}
		<br>
		{result}
	{/each}
	<div class="graph-container">
		<Graph>
			<div class="heading">Available workflows<div/>
			
			{#each nodes as node}
			  <Node node={node}/>
			{/each}

			{#each edges as edge}
			  <Edge edge={edge}/>
			{/each}
		</Graph>
	</div>
</section>

<style>
	.title {
		width: 100%;
		font-family: "EB Garamond";
		font-weight: "800";
		font-style: "bold";
		font-size: 3em;
	}

	.heading {
		font-family: "EB Garamond";
		font-size: 1.8em;
		display: flex;
		justify-content: center;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		flex: 1;
	}

	.graph-container {
		max-height: 500px;
	}
</style>
