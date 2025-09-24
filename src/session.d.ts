export interface SessionParams {
  wayfoundApiKey?: string;
  agentId?: string;
  applicationId?: string | null;
  visitorId?: string | null;
  visitorDisplayName?: string | null;
  accountId?: string | null;
  accountDisplayName?: string | null;
  sessionId?: string | null;
}

export interface SessionMessage {
  timestamp: string;
  event_type: string;
  attributes: Record<string, any>;
}

export interface CreateSessionParams {
  messages?: SessionMessage[];
  async?: boolean;
}

export interface CompleteSessionParams {
  messages?: SessionMessage[];
  async?: boolean;
}

export interface AppendToSessionParams {
  messages?: SessionMessage[];
  async?: boolean;
}

export class Session {
  constructor(params: SessionParams);
  create(params: CreateSessionParams): Promise<any>;
  /** @deprecated Use create() instead. This method will be removed in a future version. */
  completeSession(params: CompleteSessionParams): Promise<any>;
  appendToSession(params: AppendToSessionParams): Promise<any>;
}
