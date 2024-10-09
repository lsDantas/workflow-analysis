export default [
    {
      selector: 'node',
      style: {
        width: '75',
        height: '75',
        color: '#1a1a1a',
        'font-size': '18',
        'font-weight': 'lighter',
        'background-color': '#1a9988',
        content: `data(label)`,
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '150',
      }
    },
    {
      selector: 'node:selected',
      style: {
        color: 'white',
        'background-color': '#eb5600',
      }
    },
    {
      selector: 'edge',
      style: {
        width: '3',
        'curve-style': 'bezier',
        color: '#595959',
        'line-color': '#595959',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#595959',
        'font-weight': 'bold'
      }
    },
  ];
  