import axios from "axios";
import { version } from "../package.json";

const WAYFOUND_HOST = `https://app.wayfound.ai`;
const WAYFOUND_RECORDING_ACTIVE_URL = `${WAYFOUND_HOST}/api/v1/recordings/active`;
const WAYFOUND_RECORDING_COMPLETED_URL = `${WAYFOUND_HOST}/api/v1/recordings/completed`;
const SDK_LANGUAGE = "JavaScript";

export class Recording {

    /**
     * Creates an instance of the Recording class.
     *
     * @param {Object} params - The parameters for creating a new Recording instance.
     * @param {string} [params.wayfoundApiKey=process.env.WAYFOUND_API_KEY] - The API key for Wayfound.
     * @param {string} [params.agentId=process.env.WAYFOUND_AGENT_ID] - The agent ID for the recording.
     * @param {string|null} [params.recordingId=null] - The ID of the recording. If null, a new recording will be created.
     * @param {Array} [params.initialMessages=[]] - An array of initial messages to include in the recording.
     * @param {boolean} [params.published=true] - A flag indicating whether the recording is published.
     */
    constructor({wayfoundApiKey = process.env.WAYFOUND_API_KEY, agentId = process.env.WAYFOUND_AGENT_ID, recordingId = null, initialMessages = [], published = true}) {
        this.wayfoundApiKey = wayfoundApiKey;
        this.agentId = agentId;
        this.published = published;
        this.recordingId = recordingId;

        this.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.wayfoundApiKey}`,
            "X-SDK-Language": SDK_LANGUAGE,
            "X-SDK-Version": version,
        };
    }

    /**
     * Creates a new recording with the specified initial messages.
     *
     * @param {Object} params - The parameters for creating a new recording.
     * @param {Array} [params.initialMessages=[]] - An array of initial messages to include in the new recording.
     * @returns {Promise<string>} - A promise that resolves to the ID of the newly created recording.
     * @throws {Error} - Throws an error if the recording creation fails.
     *
     * @example
     * const recording = new Recording({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
     * recording.newRecording({ initialMessages: [{ role: 'user', content: 'Hello' }] })
     *     .then(recordingId => {
     *         console.log('New recording created with ID:', recordingId);
     *     })
     *     .catch(error => {
     *         console.error('Error creating new recording:', error);
     *     });
     */
    async newRecording({initialMessages = []}) {
        const recordingUrl = `${WAYFOUND_RECORDINGS_URL}?published=${this.published}`;
        try {
            const response = await axios.post(recordingUrl, { agentId: this.agentId, messages: initialMessages }, { headers: this.headers });
            this.recordingId = response.data.id;

            return this.recordingId;
        } catch (error) {
            throw new Error(`Error creating new recording: ${error}`);
        }
    }

    /**
     * Records messages to the current recording. If no recording exists, it creates a new one.
     *
     * @param {Array} messages - An array of messages to record. Each message should be an object with `role` and `content` properties.
     * @returns {Promise<void>} - A promise that resolves when the messages have been recorded.
     * @throws {Error} - Throws an error if the recording creation or update fails.
     *
     * @example
     * const recording = new Recording({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
     * recording.recordMessages([{ role: 'user', content: 'Hello' }])
     *     .then(() => {
     *         console.log('Messages recorded successfully');
     *     })
     *     .catch(error => {
     *         console.error('Error recording messages:', error);
     *     });
     */
    async recordMessages(messages) {
        if (!this.recordingId) {
            try {
                this.recordingId = await this.newRecording({initialMessages: messages});
                return;
            } catch (err) {
                throw new Error(`Error creating new recording: ${err}`);
            }
        }

        const recordingUrl = `${WAYFOUND_RECORDING_ACTIVE_URL}?published=${this.published}`;
        const payload = {
            recordingId: this.recordingId,
            messages: messages
        };
    
        try {
            const response = await axios.put(recordingUrl, payload, { headers: this.headers });
        } catch (error) {
            throw new Error(`Error updating recording request: ${error.message}`);
        }
    }

    /**
     * Completes the recording by sending the final messages and timestamps.
     *
     * @param {Object} options - The options for completing the recording.
     * @param {Array} [options.messages=[]] - An array of messages to include in the completed recording.
     * @param {string|null} [options.firstMessageAt=null] - The timestamp of the first message in ISO 8601 format (UTC). If not provided, the current timestamp will be used.
     * @param {string|null} [options.lastMessageAt=null] - The timestamp of the last message in ISO 8601 format (UTC). If not provided, the current timestamp will be used.
     * @param {string|null} [options.visitorId=null] - The visitor ID associated with the recording.
     * @returns {Promise<void>} - A promise that resolves when the recording has been completed.
     * @throws {Error} - Throws an error if the completion request fails.
     *
     * @example
     * const recording = new Recording({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
     * recording.completedRecording({ messages: [{ role: 'user', content: 'Goodbye' }] })
     *     .then(() => {
     *         console.log('Recording completed successfully');
     *     })
     *     .catch(error => {
     *         console.error('Error completing recording:', error);
     *     });
     */
    async completedRecording({messages = [], firstMessageAt = null, lastMessageAt = null, visitorId = null}) {
        if (!firstMessageAt) {
            firstMessageAt = new Date().toISOString();
        }

        if (!lastMessageAt) {
            lastMessageAt = new Date().toISOString();
        }

        const recordingUrl = `${WAYFOUND_RECORDING_COMPLETED_URL}?published=${this.published}`;
        const payload = {
            agentId: this.agentId,
            messages: messages,
            firstMessageAt: firstMessageAt,
            lastMessageAt: lastMessageAt,
        };

        if (visitorId) {
            payload.visitorId = visitorId;
        }

        try {
            const response = await axios.post(recordingUrl, payload, { headers: this.headers });
            if (response.status === 200) {
                this.recordingId = null;
            } else {
                throw new Error(`Error completing recording request: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Error completing recording request: ${error.message}`);
        }
    }
    
    /**
     * Records messages from a Langchain memory object to the current recording.
     * If no recording exists, it creates a new one.
     *
     * @param {Object} memory - The Langchain memory object containing messages to record.
     * @param {Object[]} memory.chat_memory.messages - An array of messages from the Langchain memory.
     * @param {string} memory.chat_memory.messages[].type - The type of the message, either 'ai' or 'human'.
     * @param {string} memory.chat_memory.messages[].content - The content of the message.
     * @returns {Promise<void>} - A promise that resolves when the messages have been recorded.
     * @throws {Error} - Throws an error if the recording creation or update fails.
     *
     * @example
     * const recording = new Recording({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
     * const memory = {
     *     chat_memory: {
     *         messages: [
     *             { type: 'human', content: 'Hello' },
     *             { type: 'ai', content: 'Hi there!' }
     *         ]
     *     }
     * };
     * recording.recordMessagesFromLangchainMemory(memory)
     *     .then(() => {
     *         console.log('Messages from Langchain memory recorded successfully');
     *     })
     *     .catch(error => {
     *         console.error('Error recording messages from Langchain memory:', error);
     *     });
     */
    async recordMessagesFromLangchainMemory(memory) {
        const formattedMessages = memory.chat_memory.messages.map(message => {
            if (message.type === 'ai') {
                return { role: 'assistant', content: message.content };
            } else if (message.type === 'human') {
                return { role: 'user', content: message.content };
            }
        });
    
        await this.recordMessages(formattedMessages);
    }
}