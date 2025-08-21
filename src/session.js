import axios from "axios";

const WAYFOUND_HOST = `https://app.wayfound.ai`;
const WAYFOUND_SESSION_COMPLETED_URL = `${WAYFOUND_HOST}/api/v2/sessions/completed`;
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
   */
  constructor({
    wayfoundApiKey = process.env.WAYFOUND_API_KEY,
    agentId = process.env.WAYFOUND_AGENT_ID,
    applicationId = process.env.WAYFOUND_APPLICATION_ID,
    visitorId = null,
    visitorDisplayName = null,
    accountId = null,
    accountDisplayName = null,
  }) {
    this.wayfoundApiKey = wayfoundApiKey;
    this.agentId = agentId;
    this.applicationId = applicationId;
    this.visitorId = visitorId;
    this.visitorDisplayName = visitorDisplayName;
    this.accountId = accountId;
    this.accountDisplayName = accountDisplayName;

    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.wayfoundApiKey}`,
      "X-SDK-Language": SDK_LANGUAGE,
      "X-SDK-Version": "2.0.5",
    };
  }

  /**
   * Completes the session by sending the request to Wayfound.
   * @param {Object} params - Parameters for completing the session.
   * @param {Array} [params.messages=[]] - An array of messages to include in the completed session.
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
   *     ]})
   *     .then(() => {
   *         console.log('Session completed successfully');
   *     })
   *     .catch(error => {
   *         console.error('Error completing session:', error);
   *     });
   */
  async completeSession({ messages = [] }) {
    const sessionUrl = `${WAYFOUND_SESSION_COMPLETED_URL}`;
    const payload = {
      agentId: this.agentId,
      messages: messages,
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
        throw new Error(`Error completing session request: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(`Error completing session request: ${error.message}`);
    }
  }
}
