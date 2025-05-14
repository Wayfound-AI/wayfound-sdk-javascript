export interface SessionParams {
  wayfoundApiKey?: string;
  agentId?: string;
  visitorId?: string | null;
  visitorDisplayName?: string | null;
  accountId?: string | null;
  accountDisplayName?: string | null;
}

export interface SessionMessage {
  timestamp: string;
  event_type: string;
  attributes: Record<string, any>;
}

export interface CompleteSessionParams {
  messages?: SessionMessage[];
}

export class Session {
  constructor(params: SessionParams);
  completeSession(params: CompleteSessionParams): Promise<any>;
}
