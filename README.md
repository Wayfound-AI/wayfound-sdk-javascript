# Wayfound Manager SDK for JavaScript

Welcome to the Wayfound Manager SDK for JavaScript! This SDK enables you to connect your AI Agents to Wayfound, regardless of where they are built. It supports sending transcripts, managing agent actions, and leveraging Wayfound's powerful tools for AI Agent management and analytics.

## Table of Contents

- [What is Wayfound?](#what-is-wayfound)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## What is Wayfound?

Wayfound helps companies build, activate, deploy, and manage AI Agents using the latest LLM technology.

### Key Features:
- **CONNECT**: Use the SDK or [APIs](https://wayfound-api.readme.io) to connect and send recordings into Wayfound.
- **ACTIVATE**: Integrate custom actions and tools easily.
- **MANAGE**: Monitor, analyze, and improve agents with advanced analytics and self-improvement capabilities.

## Features of the JavaScript SDK

- Send chat transcripts to Wayfound for analysis and processing.
- Enable monitoring and reporting for your agents.
- Securely authenticate agents using API keys.
- Leverage advanced Wayfound features, such as self-improvement and behavior tracking.

## Installation

Install the SDK via npm:

```bash
npm install wayfound
```

## Getting Started

### Prerequisites

To use the SDK, you need:

1.	An Agent ID: A unique identifier for each AI Agent.
2.	An API Key: A secure key for authenticating requests.

Please visit [our website](`https://wayfound.ai`) to get started.

### Initialize the SDK

Here’s how you can initialize the Wayfound SDK in your JavaScript project:

```javascript
import { Recording } from 'wayfound';

const recording = new Recording({
  wayfoundApiKey: '<API_KEY>',
  agentId: '<AGENT_ID>',
});
```

Replace <API_KEY> and <AGENT_ID> with your actual API key and Agent ID, for production scenarios keep the <API_KEY> secure.

### Usage

#### Record Messages

You can record messages and send them to Wayfound for processing:

```javascript
const messages = [
  { role: 'assistant', content: 'Hello, how can I help you?' },
  { role: 'user', content: 'I need assistance with my account.' },
];

recording.recordMessages(messages);
```

#### Manage Agent Data

Use the SDK to manage agent transcripts and access analytics for monitoring and reporting.


## License

This SDK is licensed under the MIT License