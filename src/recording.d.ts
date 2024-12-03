declare module 'recording' {
    export interface RecordingConstructorParams {
        wayfoundApiKey?: string;
        agentId?: string;
        recordingId?: string | null;
        initialMessages?: any[];
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
        headers: {
            "Content-Type": string;
            "Authorization": string;
        };

        constructor(params: RecordingConstructorParams);

        recordMessages(messages: Message[]): void;

        recordMessagesFromLangchainMemory(memory: LangchainMemory): void;
    }
}