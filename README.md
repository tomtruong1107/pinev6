# pinev6

This repository contains a Chrome extension, **PineScript Assistant**, that helps analyze Pine scripts directly on
TradingView using the OpenAI API.

## Setup

1. Obtain an OpenAI API key.
2. In Chrome, open `chrome://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select this folder.
4. Click the extension icon and enter your API key in the popup.

## Usage

Navigate to a TradingView chart. A draggable panel appears in the top-right corner with an **Analyze code** button. Clicking it sends the current editor contents and a screenshot to OpenAI and displays recommendations in the panel. The panel can be moved or closed as needed.

