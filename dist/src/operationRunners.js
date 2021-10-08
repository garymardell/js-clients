"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalActionRunner = exports.actionRunner = exports.findManyRunner = exports.findOneRunner = void 0;
const gql_query_builder_1 = require("gql-query-builder");
const FieldSelection_1 = require("./FieldSelection");
const GadgetRecordList_1 = require("./GadgetRecordList");
const support_1 = require("./support");
const hydrationOptions = (modelApiIdentifier) => {
    return {
        operation: "gadgetMeta",
        fields: [`hydrations(modelName: "${modelApiIdentifier}")`],
    };
};
const findOneRunner = async (modelManager, operation, id, defaultSelection, modelApiIdentifier, options) => {
    const variables = {};
    if (typeof id !== "undefined")
        variables.id = { type: "GadgetID", required: true, value: id };
    const plan = (0, gql_query_builder_1.query)([
        {
            operation,
            fields: (0, FieldSelection_1.fieldSelectionToGQLBuilderFields)(options?.select || defaultSelection),
            variables,
        },
        hydrationOptions(modelApiIdentifier),
    ]);
    const response = await modelManager.connection.currentClient.query(plan.query, plan.variables).toPromise();
    const record = (0, support_1.assertOperationSuccess)(response, [operation]);
    return (0, support_1.hydrateRecord)(response, record);
};
exports.findOneRunner = findOneRunner;
const findManyRunner = async (modelManager, operation, defaultSelection, modelApiIdentifier, options) => {
    const plan = (0, gql_query_builder_1.query)([
        {
            operation,
            fields: [
                {
                    pageInfo: ["hasNextPage", "hasPreviousPage", "startCursor", "endCursor"],
                },
                {
                    edges: ["cursor", { node: (0, FieldSelection_1.fieldSelectionToGQLBuilderFields)(options?.select || defaultSelection) }],
                },
            ],
            variables: {
                after: { value: options?.after, type: "String", required: false },
                first: { value: options?.first, type: "Int", required: false },
                before: { value: options?.before, type: "String", required: false },
                last: { value: options?.last, type: "Int", required: false },
                sort: { value: options?.sort, type: (0, support_1.sortTypeName)(modelApiIdentifier) + "!", list: true },
                filter: { value: options?.filter, type: (0, support_1.filterTypeName)(modelApiIdentifier) + "!", list: true },
                search: { value: options?.search, type: "String", required: false },
            },
        },
        hydrationOptions(modelApiIdentifier),
    ]);
    const response = await modelManager.connection.currentClient.query(plan.query, plan.variables).toPromise();
    const connectionObject = (0, support_1.assertOperationSuccess)(response, [operation]);
    const records = (0, support_1.hydrateConnection)(response, connectionObject);
    return GadgetRecordList_1.GadgetRecordList.boot(modelManager, records, { options, pageInfo: connectionObject.pageInfo });
};
exports.findManyRunner = findManyRunner;
const actionRunner = async (modelManager, operation, defaultSelection, modelApiIdentifier, isBulkAction, variables, options, namespace) => {
    let actionOperation = {
        operation,
        fields: [
            "success",
            { errors: ["message", "code", { "... on InvalidRecordError": [{ validationErrors: ["message", "apiIdentifier"] }] }] },
        ],
        variables,
    };
    const selection = options?.select || defaultSelection;
    if (selection)
        actionOperation.fields.push({ [modelApiIdentifier]: (0, FieldSelection_1.fieldSelectionToGQLBuilderFields)(selection) });
    const dataPath = [operation];
    if (namespace) {
        actionOperation = {
            operation: namespace,
            fields: [actionOperation],
        };
        dataPath.unshift(namespace);
    }
    const plan = (0, gql_query_builder_1.mutation)([actionOperation, hydrationOptions(modelApiIdentifier)]);
    const response = await modelManager.connection.currentClient.mutation(plan.query, plan.variables).toPromise();
    // pass bulk responses through without any assertions since we can have a success: false response but still want
    // to process it in a similar fashion since some of the records could have been processed
    const mutationResult = isBulkAction ? (0, support_1.get)(response.data, dataPath) : (0, support_1.assertMutationSuccess)(response, dataPath);
    // todo this does not support pagination params right now, we'll need to add it to bulk action Results
    if (isBulkAction) {
        return (0, support_1.hydrateRecordArray)(response, mutationResult[modelApiIdentifier]);
    }
    else {
        return (0, support_1.hydrateRecord)(response, mutationResult[modelApiIdentifier]);
    }
};
exports.actionRunner = actionRunner;
const globalActionRunner = async (connection, operation, variables, namespace) => {
    let actionOperation = {
        operation,
        fields: [
            "success",
            { errors: ["message", "code", { "... on InvalidRecordError": [{ validationErrors: ["message", "apiIdentifier"] }] }] },
            "result",
        ],
        variables,
    };
    const dataPath = [operation];
    if (namespace) {
        actionOperation = {
            operation: namespace,
            fields: [actionOperation],
        };
        dataPath.unshift(namespace);
    }
    const plan = (0, gql_query_builder_1.mutation)([actionOperation]);
    const response = await connection.currentClient.mutation(plan.query, plan.variables).toPromise();
    const actionResult = (0, support_1.assertMutationSuccess)(response, dataPath);
    return actionResult.result;
};
exports.globalActionRunner = globalActionRunner;
//# sourceMappingURL=operationRunners.js.map