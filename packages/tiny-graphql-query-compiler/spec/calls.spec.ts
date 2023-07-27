import { Call, Var, compile, compileWithVariableValues } from "../src";
import { expectValidGraphQLQuery } from "./helpers";

describe("compiling queries with field calls", () => {
  test("it should compile a query that calls a field with a hardcoded value", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: 100 }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toMatchInlineSnapshot(`
      "query  {
        id
        name
        truncatedHTML(length: 100) 
      }"
    `);
  });

  test("it should compile a query that calls a field with a variable value", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: Var({ type: "Int!" }) }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toMatchInlineSnapshot(`
      "query ($length: Int!) {
        id
        name
        truncatedHTML(length: $length) 
      }"
    `);
  });

  test("it should compile a query that calls fields with multiple variable values", () => {
    const result = compile({
      type: "query",
      fields: {
        users: Call(
          { first: Var({ type: "Int" }), after: Var({ type: "String" }) },
          {
            edges: {
              node: { id: true },
            },
          }
        ),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toMatchInlineSnapshot(`
      "query ($first: Int, $after: String) {
        users(first: $first, after: $after) { 
          edges {
            node {
              id
            }
          } 
        }
      }"
    `);
  });

  test("it should compile a query that calls fields with a different name than the variable's name", () => {
    const result = compile({
      type: "query",
      fields: {
        users: Call(
          { first: Var({ type: "Int", name: "count" }) },
          {
            edges: {
              node: { id: true },
            },
          }
        ),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toContain("$count: Int");
    expect(result).toContain("first: $count");
    expect(result).toMatchInlineSnapshot(`
      "query ($count: Int) {
        users(first: $count) { 
          edges {
            node {
              id
            }
          } 
        }
      }"
    `);
  });

  test("it should compile a query that calls a field with a string that starts with a $", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: "$length" }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toContain(`"$length"`);
    expect(result).toMatchInlineSnapshot(`
      "query  {
        id
        name
        truncatedHTML(length: "$length") 
      }"
    `);
  });

  test("it should compile a query that calls a field with null", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: null }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).not.toContain("length:");
    expect(result).toMatchInlineSnapshot(`
      "query  {
        id
        name
        truncatedHTML 
      }"
    `);
  });

  test("it should compile a query that calls a field with undefined", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: null }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).not.toContain("length:");
    expect(result).toMatchInlineSnapshot(`
      "query  {
        id
        name
        truncatedHTML 
      }"
    `);
  });

  test("it should compile a query that calls a field with a null variable", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: Var({ type: "String", value: null }) }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toMatchInlineSnapshot(`
      "query ($length: String) {
        id
        name
        truncatedHTML(length: $length) 
      }"
    `);
  });

  test("it should compile a query that calls a field with an undefined variable", () => {
    const result = compile({
      type: "query",
      fields: {
        id: true,
        name: true,
        truncatedHTML: Call({ length: Var({ type: "String", value: undefined }) }),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toMatchInlineSnapshot(`
      "query ($length: String) {
        id
        name
        truncatedHTML(length: $length) 
      }"
    `);
  });

  test("it should compile a query that calls a field with a subselection", () => {
    const result = compile({
      type: "query",
      fields: {
        users: Call(
          { first: 10 },
          {
            edges: {
              node: {
                id: true,
              },
            },
          }
        ),
      },
    });

    expectValidGraphQLQuery(result);
    expect(result).toMatchInlineSnapshot(`
      "query  {
        users(first: 10) { 
          edges {
            node {
              id
            }
          } 
        }
      }"
    `);
  });

  describe("with variable values", () => {
    test("it should compile a query that calls a field with a hardcoded value", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          id: true,
          name: true,
          truncatedHTML: Call({ length: 100 }),
        },
      });

      expectValidGraphQLQuery(query);
      expect(variables).toEqual({});
    });

    test("it should compile a query that calls a field with a variable value that is provided", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          id: true,
          name: true,
          truncatedHTML: Call({ length: Var({ type: "Int!", value: 10 }) }),
        },
      });

      expectValidGraphQLQuery(query);
      expect(variables).toEqual({
        length: 10,
      });
    });

    test("it should compile a query that calls a field with a variable value that is not provided", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          id: true,
          name: true,
          truncatedHTML: Call({ length: Var({ type: "Int!" }) }),
        },
      });

      expectValidGraphQLQuery(query);
      expect(query).toMatchInlineSnapshot(`
        "query  {
          id
          name
          truncatedHTML 
        }"
      `);
      expect(variables).toEqual({});
    });

    test("it should compile a query that calls fields with multiple variable values", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          users: Call(
            { first: Var({ type: "Int", value: 10 }), after: Var({ type: "String", value: "abcd" }) },
            {
              edges: {
                node: { id: true },
              },
            }
          ),
        },
      });

      expectValidGraphQLQuery(query);
      expect(query).toMatchInlineSnapshot(`
        "query ($first: Int, $after: String) {
          users(first: $first, after: $after) { 
            edges {
              node {
                id
              }
            } 
          }
        }"
      `);
      expect(variables).toEqual({ first: 10, after: "abcd" });
    });

    test("it should compile a query that calls fields with a different name than the variable's name", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          users: Call(
            { first: Var({ type: "Int", name: "count", value: 10 }) },
            {
              edges: {
                node: { id: true },
              },
            }
          ),
        },
      });

      expectValidGraphQLQuery(query);
      expect(query).toContain("$count: Int");
      expect(query).toContain("first: $count");
      expect(variables).toEqual({ count: 10 });
    });

    test("it should compile a query and variables with a null variable", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          id: true,
          name: true,
          truncatedHTML: Call({ length: Var({ type: "String", value: null }) }),
        },
      });

      expectValidGraphQLQuery(query);
      expect(query).not.toContain("length:");
      expect(query).toMatchInlineSnapshot(`
        "query  {
          id
          name
          truncatedHTML 
        }"
      `);
      expect(variables).toMatchInlineSnapshot(`{}`);
    });

    test("it should compile a query and variables with an undefined variable", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          id: true,
          name: true,
          truncatedHTML: Call({ length: Var({ type: "String", value: undefined }) }),
        },
      });

      expectValidGraphQLQuery(query);
      expect(query).not.toContain("length:");
      expect(query).toMatchInlineSnapshot(`
        "query  {
          id
          name
          truncatedHTML 
        }"
      `);
      expect(variables).toMatchInlineSnapshot(`{}`);
    });

    test("it should compile a mix of variables and plain values", () => {
      const { query, variables } = compileWithVariableValues({
        type: "query",
        fields: {
          users: Call(
            {
              first: Var({ type: "Int", value: 10 }),
              after: Var({ type: "String", value: "cursor" }),
              before: Var({ type: "String", value: null }),
              filter: "bar",
            },
            {
              id: true,
              name: true,
            }
          ),
        },
      });

      expectValidGraphQLQuery(query);
      expect(query).toMatchInlineSnapshot(`
        "query ($first: Int, $after: String) {
          users(first: $first, after: $after, filter: "bar") { 
            id
            name 
          }
        }"
      `);
      expect(variables).toMatchInlineSnapshot(`
        {
          "after": "cursor",
          "first": 10,
        }
      `);
    });
  });
});
