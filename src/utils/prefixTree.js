import { flatten, fromPairs, partition } from 'lodash-es';

const createPrefixNode = (labels, nodeChar = "", treeDepth = 0) => {
    // Gather labels with length matching tree depth for the node
    const hasReachedFullLength = (label) => label.length === treeDepth;
    const [nodeLabels, childrenLabels] = partition(labels, hasReachedFullLength);

    // Generate node children
    const charGroups = extractCharGroups(childrenLabels, treeDepth);
    const children = fromPairs(charGroups)

    return {
        nodeChar,
        treeDepth,
        labels: nodeLabels,
        children,
    };
};

const extractCharGroups = (labels, treeDepth) => {
    if (labels.length === 0) {
        return [];
    }

    // Identify labels that share the same character at the tree-depth position
    const referenceChar = labels[0][treeDepth];
    const matchesReferenceChar = (label) => label[treeDepth] === referenceChar;

    const [matchingLabels, otherLabels] = partition(labels, matchesReferenceChar);

    // Generate leading character group
    const newNode = createPrefixNode(matchingLabels, referenceChar, treeDepth + 1);
    const charGroup = [referenceChar, newNode];

    // Generater remaining character groups
    const otherCharGroups = extractCharGroups(otherLabels, treeDepth);

    return [charGroup, ...otherCharGroups];
};

const printPrefixTree = (tree, treeDepth = 0) => {
    const { nodeChar, labels, children } = tree;
    
    const spacing = "  ".repeat(treeDepth);
    const labelsText = labels.length > 0
        ? ` - ${labels}`
        : '';

    console.log(`${spacing}\\`);
    console.log(`${spacing} ${nodeChar}${labelsText}`);

    Object.values(children).forEach((child) => {
        printPrefixTree(child, treeDepth + 1)
    });
};

const getBranchLabels = (node) => {
    const childNodes = Object.values(node.children);
    const childLabels = childNodes.map(getBranchLabels);

    return [...node.labels, ...flatten(childLabels)];
};

export function generatePrefixTree(labels) { return createPrefixNode(labels) };

export function searchPrefixTree(searchTerm, node, treeDepth = 0) {
    if (treeDepth >= searchTerm.length) {
        return getBranchLabels(node);
    }

    const nextCharacter = searchTerm[treeDepth];
    const nextNode = node.children[nextCharacter];

    const results = nextNode
        ? searchPrefixTree(searchTerm, nextNode, treeDepth + 1)
        : [];

    return results;
};