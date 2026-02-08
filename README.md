# Foca no Carnaval

A web data extraction platform for carnival event information.

## What is this?

This project extracts carnival event data from various websites using an automated Electron-based pipeline. Each website has its own extraction configuration that defines how to interact with the page and extract structured data.

## Quick Start

```bash
# Extract data from a site
npm run extract

# Run tests
npm test
```

## Project Structure

- **apps/data-extractor/** - Extraction platform built with Electron
- **scripts/** - Utility scripts
- **assets/** - Static resources

## Sites

Currently supported extraction sources:

- **carnaval-recife-pe-gov-br** - Official Recife carnival site
- **pe-no-carnaval** - PE Carnival events

Each site has its own extraction pipeline with interactions, readers, and configuration.

## Learn More

See [apps/data-extractor/README.md](apps/data-extractor/README.md) for detailed platform documentation and how to create new extractors.


## Sources

- [x] https://penocarnaval.com.br/programacao/
- [x] https://carnaval.recife.pe.gov.br/
- [x] https://www.olinda.pe.gov.br/programacao-do-carnaval-2026-coloca-todo-mundo-na-folia-em-olinda/
- [x] https://recbeatfestival.com/#programacao
