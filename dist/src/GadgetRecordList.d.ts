import { GadgetRecord } from "./GadgetRecord";
import { InternalModelManager } from "./InternalModelManager";
import { ModelManager } from "./ModelManager";
import type { PaginationOptions } from "./operationRunners";
declare type PaginationConfig = {
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
    options?: PaginationOptions;
};
/** Represents a list of objects returned from the API. Facilitates iterating and paginating. */
export declare class GadgetRecordList<Shape> extends Array<GadgetRecord<Shape>> {
    modelManager: ModelManager | InternalModelManager;
    pagination: PaginationConfig;
    /** Internal method used to create a list. Should not be used by applications. */
    static boot<Shape>(modelManager: ModelManager | InternalModelManager, nodes: GadgetRecord<Shape>[], pagination: PaginationConfig): GadgetRecordList<Shape>;
    static get [Symbol.species](): ArrayConstructor;
    firstOrThrow(): GadgetRecord<Shape>;
    toJSON(): any[];
    get hasNextPage(): boolean;
    get hasPreviousPage(): boolean;
    nextPage(): Promise<GadgetRecordList<Shape>>;
    previousPage(): Promise<GadgetRecordList<Shape>>;
}
export {};
