import { Call, Var, compileWithVariableValues } from "tiny-graphql-query-compiler";
import { filterTypeName, sortTypeName } from "./support.js";
const hydrationOptions = (modelApiIdentifier) => {
    return {
        gadgetMeta: {
            [`hydrations(modelName: "${modelApiIdentifier}")`]: true,
        },
    };
};
/**
 * Converts Selection nested object format to the tiny-graphql-query-compiler shape
 **/
const fieldSelectionToQueryCompilerFields = (selection, includeTypename = false) => {
    const output = { ...selection };
    if (includeTypename)
        output.__typename = true;
    return output;
};
const directivesForOptions = (options) => {
    console.log(options);
    if (options === null || options === void 0 ? void 0 : options.live)
        return ["@live"];
    return undefined;
};
export const findOneOperation = (operation, id, defaultSelection, modelApiIdentifier, options) => {
    const variables = {};
    if (typeof id !== "undefined")
        variables.id = Var({ type: "GadgetID", required: true, value: id });
    console.log(directivesForOptions(options));
    return compileWithVariableValues({
        type: "query",
        name: operation,
        fields: {
            [operation]: Call(variables, fieldSelectionToQueryCompilerFields((options === null || options === void 0 ? void 0 : options.select) || defaultSelection, true)),
            ...hydrationOptions(modelApiIdentifier),
        },
        directives: directivesForOptions(options),
    });
};
export const findOneByFieldOperation = (operation, fieldName, fieldValue, defaultSelection, modelApiIdentifier, options) => {
    return findManyOperation(operation, defaultSelection, modelApiIdentifier, {
        ...options,
        first: 2,
        filter: {
            [fieldName]: {
                equals: fieldValue,
            },
        },
    });
};
export const findManyOperation = (operation, defaultSelection, modelApiIdentifier, options) => {
    return compileWithVariableValues({
        type: "query",
        name: operation,
        fields: {
            [operation]: Call({
                after: Var({ value: options === null || options === void 0 ? void 0 : options.after, type: "String" }),
                first: Var({ value: options === null || options === void 0 ? void 0 : options.first, type: "Int" }),
                before: Var({ value: options === null || options === void 0 ? void 0 : options.before, type: "String" }),
                last: Var({ value: options === null || options === void 0 ? void 0 : options.last, type: "Int" }),
                sort: (options === null || options === void 0 ? void 0 : options.sort) ? Var({ value: options.sort, type: `[${sortTypeName(modelApiIdentifier)}!]` }) : undefined,
                filter: (options === null || options === void 0 ? void 0 : options.filter) ? Var({ value: options.filter, type: `[${filterTypeName(modelApiIdentifier)}!]` }) : undefined,
                search: (options === null || options === void 0 ? void 0 : options.search) ? Var({ value: options.search, type: "String" }) : undefined,
            }, {
                pageInfo: { hasNextPage: true, hasPreviousPage: true, startCursor: true, endCursor: true },
                edges: {
                    cursor: true,
                    node: fieldSelectionToQueryCompilerFields((options === null || options === void 0 ? void 0 : options.select) || defaultSelection, true),
                },
            }),
            ...hydrationOptions(modelApiIdentifier),
        },
        directives: directivesForOptions(options),
    });
};
const ErrorsSelection = {
    message: true,
    code: true,
    "... on InvalidRecordError": {
        validationErrors: {
            message: true,
            apiIdentifier: true,
        },
    },
};
const variableOptionsToVariables = (variables) => {
    return Object.fromEntries(Object.entries(variables).map(([name, options]) => [name, Var(options)]));
};
export const actionOperation = (operation, defaultSelection, modelApiIdentifier, modelSelectionField, variables, options, namespace) => {
    const selection = (options === null || options === void 0 ? void 0 : options.select) || defaultSelection;
    let fields = {
        [operation]: Call(variableOptionsToVariables(variables), {
            success: true,
            errors: ErrorsSelection,
            [modelSelectionField]: selection ? fieldSelectionToQueryCompilerFields(selection, true) : false,
        }),
    };
    if (namespace) {
        fields = {
            [namespace]: fields,
        };
    }
    const actionOperation = {
        type: "mutation",
        name: operation,
        fields: {
            ...fields,
            ...hydrationOptions(modelApiIdentifier),
        },
        directives: directivesForOptions(options),
    };
    return compileWithVariableValues(actionOperation);
};
export const globalActionOperation = (operation, variables, namespace, options) => {
    let fields = {
        [operation]: Call(variableOptionsToVariables(variables), {
            success: true,
            errors: ErrorsSelection,
            result: true,
        }),
    };
    const dataPath = [operation];
    if (namespace) {
        fields = {
            [namespace]: fields,
        };
        dataPath.unshift(namespace);
    }
    return compileWithVariableValues({
        type: "mutation",
        name: operation,
        fields,
        directives: directivesForOptions(options),
    });
};
//# sourceMappingURL=operationBuilders.js.map