import { flatten } from 'lodash-es';

// Generate nodes and edges for Cytoscape
export function generateGraphData(nodeData, retrieveNode, tag = '') {
	const idPostfix = tag === '' ? '' : `-${tag}`;

	const nodes = nodeData.map((entry) => ({ id: `N${entry.id}${idPostfix}`, label: entry.name }));

	const edges = nodeData.reduce((currentEdges, entry) => {
		const newEdges = entry.parents.map((parentName) => {
			const parentNode = retrieveNode(parentName);

			const newEdge = {
				id: `E${parentNode.id}-${entry.id}${idPostfix}`,
				source: `N${parentNode.id}${idPostfix}`,
				target: `N${entry.id}${idPostfix}`
			};

			return newEdge;
		});
		return [...currentEdges, ...newEdges];
	}, []);

	return [nodes, edges];
}

export function retrieveUpstreamNodes(nodeName, retrieveNode) {
	const node = retrieveNode(nodeName);

	const upstreamNodes = node.parents.map((parent) => retrieveUpstreamNodes(parent, retrieveNode));

	return [node, ...flatten(upstreamNodes)];
}
