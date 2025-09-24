import axios from "axios";

const WAYFOUND_HOST = `https://app.wayfound.ai`;
const WAYFOUND_CREATE_SESSION_URL = `${WAYFOUND_HOST}/api/v2/sessions`;
const WAYFOUND_APPEND_TO_SESSION_URL = `${WAYFOUND_HOST}/api/v2/sessions`;
const SDK_LANGUAGE = "JavaScript";

export class Session {
  /**
   * Creates an instance of the Session class.
   *
   * @param {Object} params - The parameters for creating a new Session instance.
   * @param {string} [params.wayfoundApiKey=process.env.WAYFOUND_API_KEY] - The Wayfound API key. Defaults to the environment variable WAYFOUND_API_KEY.
   * @param {string} [params.agentId=process.env.WAYFOUND_AGENT_ID] - The agent ID. Defaults to the environment variable WAYFOUND_AGENT_ID.
   * @param {string|null} [params.applicationId=null] - The application ID. Optional parameter.
   * @param {string|null} [params.visitorId=null] - The visitor's unique identifier.
   * @param {string|null} [params.visitorDisplayName=null] - The display name of the visitor.
   * @param {string|null} [params.accountId=null] - The account's unique identifier.
   * @param {string|null} [params.accountDisplayName=null] - The display name of the account.
   * @param {string|null} [params.sessionId=null] - The session ID. Optional parameter for existing sessions.
   */
  constructor({
    wayfoundApiKey = process.env.WAYFOUND_API_KEY,
    agentId = process.env.WAYFOUND_AGENT_ID,
    applicationId = process.env.WAYFOUND_APPLICATION_ID,
    visitorId = null,
    visitorDisplayName = null,
    accountId = null,
    accountDisplayName = null,
    sessionId = null,
  }) {
    this.wayfoundApiKey = wayfoundApiKey;
    this.agentId = agentId;
    this.applicationId = applicationId;
    this.visitorId = visitorId;
    this.visitorDisplayName = visitorDisplayName;
    this.accountId = accountId;
    this.accountDisplayName = accountDisplayName;
    this.sessionId = sessionId;

    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.wayfoundApiKey}`,
      "X-SDK-Language": SDK_LANGUAGE,
      "X-SDK-Version": "2.3.0",
    };
  }

  /**
   * Creates a session by sending the request to Wayfound.
   * @param {Object} params - Parameters for creating the session.
   * @param {Array} [params.messages=[]] - An array of messages to include in the session.
   * @param {boolean} [params.async=true] - Whether to process the session asynchronously. If false, the request will block until processing is complete.
   * @returns {Promise<Object>} - A promise that resolves with the API response when the session has been created.
   * @throws {Error} - Throws an error if the creation request fails.
   *
   * @example
   * const session = new Session({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
   * session.create({
   *     messages: [
   *       {
   *          timestamp: "2025-05-07T10:00:00Z",
   *          event_type: 'user_message',
   *          attributes: {
   *            content: 'Hello!'
   *          }
   *       },
   *     ],
   *     async: false // Request will block until processing is complete
   *     })
   *     .then(() => {
   *         console.log('Session created successfully');
   *     })
   *     .catch(error => {
   *         console.error('Error creating session:', error);
   *     });
   */
  async create({ messages = [], async = true }) {
    if (this.sessionId !== null) {
      throw new Error(
        "Session already created. Use appendToSession to add more messages."
      );
    }

    const sessionUrl = `${WAYFOUND_CREATE_SESSION_URL}`;
    const payload = {
      agentId: this.agentId,
      messages: messages,
      async: async,
    };

    if (this.visitorId) {
      payload.visitorId = this.visitorId;
    }

    if (this.visitorDisplayName) {
      payload.visitorDisplayName = this.visitorDisplayName;
    }

    if (this.accountId) {
      payload.accountId = this.accountId;
    }

    if (this.accountDisplayName) {
      payload.accountDisplayName = this.accountDisplayName;
    }

    if (this.applicationId) {
      payload.applicationId = this.applicationId;
    }

    try {
      const response = await axios.post(sessionUrl, payload, {
        headers: this.headers,
      });
      if (response.status !== 200) {
        throw new Error(`Error creating session: ${response.status}`);
      }
      this.sessionId = response.data.id;
      return response.data;
    } catch (error) {
      throw new Error(`Error creating session: ${error.message}`);
    }
  }

  /**
   * @deprecated Use create() instead. This method will be removed in a future version.
   * Completes the session by sending the request to Wayfound.
   * @param {Object} params - Parameters for completing the session.
   * @param {Array} [params.messages=[]] - An array of messages to include in the completed session.
   * @param {boolean} [params.async=true] - Whether to process the session asynchronously. If false, the request will block until processing is complete.
   * @returns {Promise<Object>} - A promise that resolves with the Axios response when the session has been completed.
   * @throws {Error} - Throws an error if the completion request fails.
   *
   * @example
   * const session = new Session({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
   * session.completeSession({
   *     messages: [
   *       {
   *          timestamp: "2025-05-07T10:00:00Z",
   *          event_type: 'user_message',
   *          attributes: {
   *            content: 'Hello!'
   *          }
   *       },
   *     ],
   *     async: false // Request will block until processing is complete
   *     })
   *     .then(() => {
   *         console.log('Session completed successfully');
   *     })
   *     .catch(error => {
   *         console.error('Error completing session:', error);
   *     });
   */
  async completeSession({ messages = [], async = true }) {
    console.warn(
      "DEPRECATED: completeSession() is deprecated and will be removed in a future version. Use create() instead."
    );
    return this.create({ messages, async });
  }

  /**
   * Appends messages to an existing session.
   * @param {Object} params - Parameters for appending to the session.
   * @param {Array} [params.messages=[]] - An array of messages to append to the session.
   * @param {boolean} [params.async=true] - Whether to process the append asynchronously. If false, the request will block until processing is complete.
   * @returns {Promise<Object>} - A promise that resolves with the API response when messages have been appended.
   * @throws {Error} - Throws an error if no session ID is available or if the append request fails.
   *
   * @example
   * const session = new Session({ wayfoundApiKey: 'your-api-key', agentId: 'your-agent-id' });
   * // First complete a session to get a session ID
   * await session.completeSession({ messages: [...] });
   *
   * // Then append additional messages
   * session.appendToSession({
   *     messages: [
   *       {
   *          timestamp: "2025-05-07T10:05:00Z",
   *          event_type: 'user_message',
   *          attributes: {
   *            content: 'Follow up message'
   *          }
   *       },
   *     ],
   *     async: false // Request will block until processing is complete
   *     })
   *     .then(() => {
   *         console.log('Messages appended successfully');
   *     })
   *     .catch(error => {
   *         console.error('Error appending to session:', error);
   *     });
   */
  async appendToSession({ messages = [], async = true }) {
    if (this.sessionId === null) {
      throw new Error(
        "No sessionId available. Complete a session first before appending."
      );
    }

    if (messages === null) {
      messages = [];
    }

    const appendUrl = `${WAYFOUND_APPEND_TO_SESSION_URL}/${this.sessionId}`;
    const payload = {
      messages: messages,
      async: async,
    };

    try {
      const response = await axios.put(appendUrl, payload, {
        headers: this.headers,
      });
      if (response.status !== 200) {
        throw new Error(`Error appending to session: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(`Error appending to session: ${error.message}`);
    }
  }
}
