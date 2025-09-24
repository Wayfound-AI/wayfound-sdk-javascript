# Wayfound Manager SDK for JavaScript

Welcome to the Wayfound Manager SDK for JavaScript! This SDK enables you to connect your AI Agents to Wayfound, regardless of where they are built. It supports creating sessions and sending them to Wayfound.

## Table of Contents

- [What is Wayfound?](#what-is-wayfound)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## What is Wayfound?

Wayfound gives you a central hub to manage and maximize the benefits from all of your AI agent team members in a coordinated way — resulting in accelerated agent maturity, faster ROI, improved trust, and reduced risk.

## Features

- Send sessions to Wayfound for analysis and processing.

## Installation

Install the SDK via npm:

```bash
npm install wayfound
```

## Getting Started

### Prerequisites

To use the SDK, you need:

1. An Agent ID: A unique identifier for each AI Agent.
2. An API Key: A secure key for authenticating requests.

Please visit [our website](`https://wayfound.ai`) to get started.

### Initialize the SDK

Here’s how you can initialize the Wayfound SDK in your JavaScript project:

```javascript
import { Session } from "wayfound";

const session = new Session({
  wayfoundApiKey: "<API_KEY>",
  agentId: "<AGENT_ID>",
});
```

Replace <API_KEY> and <AGENT_ID> with your actual API key and Agent ID, for production scenarios keep the <API_KEY> secure.

### Usage

#### Record Session

You can create sessions and send them to Wayfound for processing:

```javascript
const messages = [
  {
    timestamp: "2025-05-07T10:00:00Z",
    event_type: "assistant_message",
    attributes: {
      content: "Hello!",
    },
  },
  {
    timestamp: "2025-05-07T10:00:10Z",
    event_type: "user_message",
    attributes: {
      content: "I need help!",
    },
  },
];
await session.create({ messages });
```

## License

This SDK is licensed under the MIT License
