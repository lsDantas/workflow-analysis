<script>
    import { onMount, setContext } from 'svelte';
    import cytoscape from 'cytoscape';
    import dagre from 'cytoscape-dagre';
    import graphStyles from './graphStyles.js';

    let refElement = null;
    let cyInstance = null;

    setContext('graphSharedState', {
        getCyInstance: () => cyInstance
    });

    onMount(() => {
        cytoscape.use(dagre);

        cyInstance = cytoscape({
            container: refElement,
            style: graphStyles,
            userZoomingEnabled: false,
        });

        cyInstance.on('add', () => {
            cyInstance
                .makeLayout({
                    name: 'dagre',
                    rankDir: 'LR',
                    nodeSep: 175
                })
                .run()
        });
    });
</script>

<div class="graph" bind:this={refElement}>
    {#if cyInstance}
        <slot></slot>
    {/if}
</div>

<style>
	.graph {
        width: 100vw;
        height: 75vh;
		max-height: 100%;
	}
</style>