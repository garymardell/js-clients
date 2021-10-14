import { Client } from "@urql/core";
import fetch from "cross-fetch";
import { Client as SubscriptionClient, ClientOptions as SubscriptionClientOptions } from "graphql-ws";
import { AuthenticationModeOptions } from "./ClientOptions";
import { GadgetTransaction } from "./GadgetTransaction";
export declare type TransactionRun<T> = (transaction: GadgetTransaction) => Promise<T>;
export interface GadgetSubscriptionClientOptions extends Partial<SubscriptionClientOptions> {
    urlParams?: Record<string, string | null | undefined>;
}
export declare const $transaction: unique symbol;
export interface GadgetConnectionOptions {
    endpoint: string;
    authenticationMode?: AuthenticationModeOptions;
    websocketsEndpoint?: string;
    subscriptionClientOptions?: GadgetSubscriptionClientOptions;
    websocketImplementation?: any;
    fetchImplementation?: typeof fetch;
    environment?: "Development" | "Production";
}
/** Helper function to await the setup dance on a graphql-ws Client object. */
export declare const connectionOpen: (subscriptionClient: SubscriptionClient) => Promise<void>;
/**
 * Represents the current strategy for authenticating with the Gadget platform.
 * For individual users in web browsers, we authenticate using browser cookies.
 * For server to server communication, or traceable access from the browser, we use pre shared secrets called API Keys
 * And when within the Gadget platform itself, we use a private secret token called an Internal Auth Token. Internal Auth Tokens are managed by Gadget and should never be used by external developers.
 **/
export declare enum AuthenticationMode {
    SessionCookie = "session-cookie",
    APIKey = "api-key",
    InternalAuthToken = "internal-auth-token"
}
/**
 * Root level database connection that Actions can use to mutate data in a Gadget database.
 * Manages transactions and the connection to a Gadget API
 */
export declare class GadgetConnection {
    readonly options: GadgetConnectionOptions;
    private endpoint;
    private subscriptionClientOptions?;
    private websocketsEndpoint;
    private websocketImplementation;
    private fetchImplementation;
    private environment;
    private baseClient;
    private baseSubscriptionClient;
    private currentTransaction;
    private authenticationMode;
    constructor(options: GadgetConnectionOptions);
    get currentClient(): Client;
    enableSessionMode(): void;
    transaction: {
        <T>(options: GadgetSubscriptionClientOptions, run: TransactionRun<T>): Promise<T>;
        <T>(run: TransactionRun<T>): Promise<T>;
    };
    close(): void;
    private resetClients;
    private newBaseClient;
    private newSubscriptionClient;
    private requestHeaders;
}
