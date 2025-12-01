# Performance Testing

This directory contains k6 scripts for performance testing the application.

## Prerequisites

- [k6](https://k6.io/docs/get-started/installation/) installed on your machine.

## Running Tests

To run the performance tests, use the following command:

```bash
k6 run performance/k6-scripts.js
```

By default, it targets `http://localhost:3000`. To target a deployed environment, set the `BASE_URL` environment variable:

```bash
k6 run -e BASE_URL=https://your-vercel-app.vercel.app performance/k6-scripts.js
```

## Scenarios

The script covers the following scenarios:
1. Creating a School
2. Fetching Schools (filtered by district)
3. Creating a Material Request for the created school
4. Fetching all Material Requests
5. Fetching a specific Material Request by token
6. Updating a Material Request status
