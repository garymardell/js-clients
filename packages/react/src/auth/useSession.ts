import type {
  AnyClient,
  DefaultSelection,
  FindManyFunction,
  GadgetRecord,
  GetFunction,
  LimitToKnownKeys,
  Select,
} from "@gadgetinc/api-client-core";
import { useGet } from "../../src/useGet";
import type { OptionsType, ReadOperationOptions } from "../../src/utils";
import { useApi } from "../../src/GadgetProvider";

export type GadgetSession = GadgetRecord<Record<string, any>>;

export interface GadgetUser {
  id: string;
  [key: string]: any;
}

export type ClientWithSessionAndUserManagers<SessionGivenOptions, SessionSchemaT, UserGivenOptions, UserSchemaT> = AnyClient & {
  currentSession: { get: GetFunction<SessionGivenOptions, any, SessionSchemaT, any> };
  user: { findMany: FindManyFunction<UserGivenOptions, any, UserSchemaT, any> };
};

/**
 * Used for fetching the current `Session` record from Gadget. Will suspend while the user is being fetched.
 * @returns The current session
 */
export function useSession<
  SessionGivenOptions extends OptionsType,
  SessionSchemaT,
  UserGivenOptions extends OptionsType,
  UserSchemaT,
  Client extends ClientWithSessionAndUserManagers<SessionGivenOptions, SessionSchemaT, UserGivenOptions, UserSchemaT>,
  Options extends Client["currentSession"]["get"]["optionsType"] & ReadOperationOptions,
  ClientType extends Client | undefined
>(
  client?: ClientType,
  options?: LimitToKnownKeys<Options, Client["currentSession"]["get"]["optionsType"] & ReadOperationOptions>
): undefined extends ClientType
  ? GadgetSession
  : GadgetRecord<
      Select<
        Exclude<Exclude<ClientType, undefined>["currentSession"]["get"]["schemaType"], null | undefined>,
        DefaultSelection<
          Exclude<ClientType, undefined>["currentSession"]["get"]["selectionType"],
          Options,
          Exclude<ClientType, undefined>["currentSession"]["get"]["defaultSelection"] & {
            user: Exclude<ClientType, undefined>["user"]["findMany"]["defaultSelection"];
          }
        >
      >
    > {
  const fallbackApi = useApi() as any;
  const api = client ?? fallbackApi;

  if("currentSession" in api && "session" in api){
    console.log('[jenny] here')
    const opts:any = {
      suspense: true,
      select: {
        ...api.currentSession.get.defaultSelection,
        user: api.user.findMany.defaultSelection,
      },
      ...(options ?? {}),
    };
  
    console.log('[jenny] the opts', opts)
  const [{ data: session, error }] = useGet(api.currentSession, opts);
  
    if (error) throw error;
    if (!session) throw new Error("currentSession not found but should be present");
    return typeof client == "undefined" ? session : session as any;
  }else{
    throw new Error("api client does not have a Session model");
  }

  // return client ? session : session as any;
};
