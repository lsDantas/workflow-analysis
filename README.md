# Workflow Analysis

An application for visualizing direct acyclic graphs (DAGs) depicting workflows. Built with [Svelte 5](https://svelte-5-preview.vercel.app/docs/introduction).

## Developing

Install dependencies with `npm install`, then start a development server:

```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

This application was made to run on Vercel infrastructure. (See Svelte Vercel adapter.)

## Deploying

The application expects an API with an endpoint defined by the `VITE_API_URL` environment variable. Expected incoming data is of the form:

```python
{ 
        "nodes": [
		    {
                "id": 1,
                "name": "Aardvark",
                "parents": [],
                "type": "TYPE_1", "tags": { "planet": "earth" }
            },
		    {
                "id": 2,
                "name": "Apple",
                "parents": [],
                "type": "TYPE_2",
                "tags": { "planet": "earth", "star": "sun" }
            },
	    ]
    }

```
