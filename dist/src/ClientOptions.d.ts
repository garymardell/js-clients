import type fetch from "cross-fetch";
export interface AuthenticationModeOptions {
    apiKey?: string;
    sessionCookie?: boolean;
    internalAuthToken?: string;
}
export interface ClientOptions {
    endpoint?: string;
    authenticationMode?: AuthenticationModeOptions;
    websocketsEndpoint?: string;
    websocketImplementation?: any;
    fetchImplementation?: typeof fetch;
    environment?: "Development" | "Production";
}
