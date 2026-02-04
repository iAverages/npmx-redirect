# npmx-redirect

Browser extension that automatically redirects npmjs.com URLs to npmx.dev.

## Installation

### Download from GitHub Releases

1. Visit the [GitHub Releases](https://github.com/iAverage/npmx-redirect/releases) page
2. Download the appropriate ZIP file for your browser:
   - Chrome: `npmx-redirect-chrome-mv3.zip`
   - Firefox: `npmx-redirect-firefox-mv3.zip` (or `npmx-redirect-firefox-mv2.zip` for older versions)
   - Edge: `npmx-redirect-edge-mv3.zip`
   - Brave: `npmx-redirect-brave-mv3.zip`
   - Opera: `npmx-redirect-opera-mv3.zip`
3. Extract the ZIP file to a folder on your computer

### Install in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Select the extracted extension folder (e.g., `chrome-mv3-prod`)
5. The extension is now installed and active

### Install in Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the extracted extension folder and select the `manifest.json` file
4. The extension is now installed and active

Note: Firefox requires re-loading temporary extensions after each browser restart.

### Webstores

Currently this extension is not within any webstores.

## Usage

Once installed, the extension automatically redirects all npmjs.com URLs to their npmx.dev equivalents:

- `https://www.npmjs.com/package/react` redirects to `https://npmx.dev/package/react`
- `https://www.npmjs.com/~username` redirects to `https://npmx.dev/~username`
- `https://www.npmjs.com/org/example` redirects to `https://npmx.dev/org/example`
- Search queries are also redirected

No configuration required.

## Development

### Prerequisites

- Node.js 20+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Load the development build from `build/chrome-mv3-dev` (or your target browser) in your browser.

### Build

```bash
# Build for all browsers
pnpm build:all

# Build for specific browser
pnpm build:chrome
pnpm build:firefox
pnpm build:edge
```

Production builds are output to the `build/` directory.

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## Contributing

Contributions are welcome.

## License

MIT
