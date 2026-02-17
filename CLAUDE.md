# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run serve` - Start development server at http://localhost:1234 with hot reload
- `npm run build` - Create production bundle in `dist/` directory

## Architecture

This is a Vue.js 2 mortgage calculator widget for the Maryland Mortgage Program (MMP), bundled with Parcel 2. It's designed to be embedded on external pages via CDN-hosted assets.

### Data Flow

The calculator fetches all configuration from a Google Sheets API at runtime:
- **Products** - Mortgage products with interest rates (parsed into `Product` model)
- **Limits** - County-based income and acquisition limits by household size (parsed into `CountyLimit` model)
- **Settings** - Key-value configuration
- **Copy** - UI text/labels with markdown support
- **Fields** - Form field definitions including types, labels, tooltips

### Key Components

- `index.js` - Entry point; initializes Vue app on `[data-component="mmp-mortgage-calculator"]` elements
- `src/components/App.vue` - Root component; fetches Google Sheets data and orchestrates form/results
- `src/components/CalculatorForm.vue` - Dynamic form built from Fields sheet data
- `src/components/Results.vue` - Displays qualifying products based on user input

### Templating

Vue components use Pug for templates and SCSS for styles.

### State Sharing

Form state can be shared via URL hash (base64-encoded JSON), enabling shareable calculator results.

### Deployment

Production files are served via jsDelivr CDN from this GitHub repo. After building, increment version in README.md and test.html, commit, and create a git tag.
