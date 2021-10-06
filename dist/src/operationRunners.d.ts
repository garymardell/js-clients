import VariableOptions from "gql-query-builder/build/VariableOptions";
import { FieldSelection } from "./FieldSelection";
import { GadgetConnection } from "./GadgetConnection";
import { GadgetRecord } from "./GadgetRecord";
import { GadgetRecordList } from "./GadgetRecordList";
import { ModelManager } from "./ModelManager";
declare type AnySort = any;
declare type AnyFilter = any;
declare type SelectionOptions = {
    select?: any;
};
export declare type PaginationOptions = {
    sort?: AnySort | null;
    filter?: AnyFilter | null;
    search?: string | null;
    after?: string | null;
    first?: number | null;
    before?: string | null;
    last?: number | null;
} & SelectionOptions;
export declare const findOneRunner: <Shape = any>(modelManager: {
    connection: GadgetConnection;
}, operation: string, id: string | undefined, defaultSelection: FieldSelection, modelApiIdentifier: string, options?: SelectionOptions | null | undefined) => Promise<import("./GadgetRecord").GadgetRecordImplementation<Shape> & Shape>;
export declare const findManyRunner: <Shape = any>(modelManager: ModelManager, operation: string, defaultSelection: FieldSelection, modelApiIdentifier: string, options?: PaginationOptions | undefined) => Promise<GadgetRecordList<Shape>>;
export interface ActionRunner {
    <Shape = any>(modelManager: {
        connection: GadgetConnection;
    }, operation: string, defaultSelection: FieldSelection | null, modelApiIdentifier: string, isBulkAction: false, variables: VariableOptions, options?: SelectionOptions | null, namespace?: string | null): Promise<Shape extends void ? void : GadgetRecord<Shape>>;
    <Shape = any>(modelManager: {
        connection: GadgetConnection;
    }, operation: string, defaultSelection: FieldSelection | null, modelApiIdentifier: string, isBulkAction: true, variables: VariableOptions, options?: SelectionOptions | null, namespace?: string | null): Promise<Shape extends void ? void : GadgetRecordList<Shape>>;
}
export declare const actionRunner: ActionRunner;
export declare const globalActionRunner: (connection: GadgetConnection, operation: string, variables: VariableOptions, namespace?: string | null | undefined) => Promise<any>;
export {};
