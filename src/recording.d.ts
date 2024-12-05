declare module 'recording' {
    export interface RecordingConstructorParams {
        wayfoundApiKey?: string;
        agentId?: string;
        recordingId?: string | null;
        initialMessages?: Message[];
        published?: boolean;
    }

    export interface Message {
        role: 'assistant' | 'user';
        content: string;
    }

    export interface LangchainMemory {
        chat_memory: {
            messages: {
                type: 'ai' | 'human';
                content: string;
            }[];
        };
    }

    export class Recording {
        static WAYFOUND_RECORDINGS_URL: string;

        wayfoundApiKey: string;
        agentId: string;
        recordingId: string | null;
        published: boolean;
        headers: {
            "Content-Type": string;
            "Authorization": string;
            "X-SDK-Language": string;
            "X-SDK-Version": string;
        };

        constructor(params: RecordingConstructorParams);

        newRecording(params: { initialMessages?: Message[] }): Promise<string>;

        recordMessages(messages: Message[]): Promise<void>;

        completedRecording(params: {
            messages?: Message[];
            firstMessageAt?: string | null;
            lastMessageAt?: string | null;
            visitorId?: string | null;
        }): Promise<void>;

        recordMessagesFromLangchainMemory(memory: LangchainMemory): Promise<void>;
    }
}