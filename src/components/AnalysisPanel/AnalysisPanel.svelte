<script>
	import { keyBy } from 'lodash-es';

	import { generatePrefixTree, searchPrefixTree } from '../../utils/prefixTree';
	import { generateGraphData, retrieveUpstreamNodes } from '../../utils/graphUtils';

	import Graph from '../Graph/Graph.svelte';
	import RestoreButton from '../Buttons/RestoreButton.svelte';
	import SuggestionButton from '../Buttons/SuggestionButton.svelte';

	let { data } = $props();

	let searchTerm = $state('');
	let prefixTree = $state(null);

	let displayNodes = $state([]);
	let displayEdges = $state([]);

	let remountGraphFlag = $state(false);
	let isSubgraph = $state(false);

	const processedData = data.map((entry) => ({
		...entry,
		reference: entry.name.toLowerCase(),
		parents: entry.parents.map((parent) => parent.toLowerCase())
	}));

	const workflowsDict = keyBy(processedData, 'reference');
	const retrieveNodeByName = (reference) => workflowsDict[reference];

	const [allNodes, allEdges] = generateGraphData(processedData, retrieveNodeByName);

	displayNodes = allNodes;
	displayEdges = allEdges;

	// Search Feature
	const workflowNames = Object.keys(workflowsDict);
	prefixTree = generatePrefixTree(workflowNames);

	let searchResults = $derived.by(() => {
		if (searchTerm === '') {
			return [];
		}

		return searchPrefixTree(searchTerm.toLowerCase(), prefixTree);
	});

	// Suggestion Bar Buttons
	const handleSubgraphSelection = (nodeName, retrieveNode) => {
		const upstreamNodes = retrieveUpstreamNodes(nodeName, retrieveNode);

		const [selectNodes, selectEdges] = generateGraphData(upstreamNodes, retrieveNode, nodeName);

		displayNodes = selectNodes;
		displayEdges = selectEdges;

		remountGraphFlag = !remountGraphFlag;
		isSubgraph = true;
	};

	const restoreFullGraph = () => {
		displayNodes = allNodes;
		displayEdges = allEdges;

		remountGraphFlag = !remountGraphFlag;
		isSubgraph = false;
	};
</script>

<input class="search-box" placeholder="Search for a workflow..." bind:value={searchTerm} />

<div class="suggestion-bar">
	{#if isSubgraph}
		<RestoreButton onClick={() => restoreFullGraph()}>Restore Full Graph</RestoreButton>
	{/if}
	{#each searchResults as result}
		<SuggestionButton onClick={() => handleSubgraphSelection(result, retrieveNodeByName)}>
			{result}
		</SuggestionButton>
	{/each}
</div>

<div class="heading">Directed Acyclic Graph Visualization</div>
<div class="analysis-container">
	{#if remountGraphFlag}
		<Graph nodes={displayNodes} edges={displayEdges} retrieveNode={retrieveNodeByName} />
	{:else}
		<Graph nodes={displayNodes} edges={displayEdges} retrieveNode={retrieveNodeByName} />
	{/if}
</div>

<style>
	.search-box {
		font-weight: normal;
		font-size: 1.1em;
		border-color: transparent;
		background: #fae4d1;
		border-radius: 0.25rem;
		box-shadow: 1px 1px 4px 0px #999999;
		padding: 10px;
	}

	.search-box:focus {
		outline: 0.15rem solid #cc491a;
	}

	.suggestion-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5em;
		width: 100%;
		padding-top: 20px;
		padding-bottom: 20px;
	}
	.heading {
		font-family: 'EB Garamond';
		font-size: 1.8em;
		display: flex;
		justify-content: center;
	}

	.analysis-container {
		display: flex;
		flex-grow: 1;
		flex-direction: row;
		justify-content: center;
		align-items: start;
		width: 100%;
		max-height: 500px;
	}
</style>
