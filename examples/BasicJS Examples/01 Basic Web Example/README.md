# Basic Web Example

This example demonstrates the absolute minimum implementation of Zogo 360 in a web page.

## What This Example Shows

- How to include the Zogo 360 package via CDN
- How to add the `<zogo-360>` element to a page
- Auto-initialization with default settings

## Requirements

- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Auto-initialization**: The component automatically initializes when the page loads
- **Default dimensions**: Uses 100% width and 600px height
- **CDN delivery**: Loads the package from Zogo's CDN

## How to Use

1. Replace `YOUR_AUTH_TOKEN_HERE` with your actual authentication token
2. Open the HTML file in a web browser
3. Zogo 360 will automatically load and display

## What Happens

When you open this example:

1. The browser loads the Zogo 360 package from the CDN
2. The package registers the `<zogo-360>` custom element
3. The element automatically initializes using the provided token
4. An iframe is created and displays the Zogo 360 interface
