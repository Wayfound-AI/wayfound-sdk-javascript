const axios = require('axios');

class Recording {
    static WAYFOUND_RECORDINGS_URL = "https://app.wayfound.ai/api/v1/recordings/active";

    constructor(wayfoundApiKey = process.env.WAYFOUND_API_KEY, agentId = process.env.WAYFOUND_AGENT_ID, initialMessages = []) {
        this.wayfoundApiKey = wayfoundApiKey;
        this.agentId = agentId;

        this.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.wayfoundApiKey}`
        };

        const payload = {
            agentId: this.agentId,
            messages: initialMessages
        };

        axios.post(Recording.WAYFOUND_RECORDINGS_URL, payload, { headers: this.headers })
            .then(response => {
                this.recordingId = response.data.id;
            })
            .catch(error => {
                console.error(`Error during POST request: ${error}`);
                this.recordingId = null;
            });
    }

    recordMessages(messages) {
        const payload = {
            recordingId: this.recordingId,
            messages: messages
        };

        axios.put(Recording.WAYFOUND_RECORDINGS_URL, payload, { headers: this.headers })
            .then(response => {
                // Handle successful response if needed
            })
            .catch(error => {
                console.error(`Error during PUT request: ${error}`);
            });
    }

    recordMessagesFromLangchainMemory(memory) {
        const formattedMessages = memory.chat_memory.messages.map(message => {
            if (message.type === 'ai') {
                return { role: 'assistant', content: message.content };
            } else if (message.type === 'human') {
                return { role: 'user', content: message.content };
            }
        });

        this.recordMessages(formattedMessages);
    }
}