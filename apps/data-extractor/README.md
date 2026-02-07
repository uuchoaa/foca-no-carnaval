# Data Extractor - PE no Carnaval

Electron app to extract event data from the PE no Carnaval website.

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm start
```

The app will:
1. Open the PE no Carnaval programming page
2. Automatically click the "Carregar mais eventos" (Load more events) button
3. Wait for new events to load
4. Repeat until all events are loaded
5. Output logs to console/STDOUT

## Features

- Automatically loads all events by clicking the "Load more" button
- Console logs are piped to STDOUT
- Non-blocking, recursive approach to handle dynamic content loading
