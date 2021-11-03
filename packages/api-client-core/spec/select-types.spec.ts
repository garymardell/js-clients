import { AssertTrue, IsExact } from "conditional-type-checks";
import { Select } from "../src/types";
import { TestSchema } from "./TestSchema";

type _SelectingProperties = AssertTrue<IsExact<Select<TestSchema, { num: true }>, { num: number }>>;

type _ConditionallySelectingProperties = AssertTrue<
  IsExact<Select<TestSchema, { num: true; str: undefined; obj: false }>, { num: number }>
>;

type _SelectingNestedProperties = AssertTrue<
  IsExact<
    Select<TestSchema, { num: true; obj: { test: true; bool: false; deep: { property: true } } }>,
    { num: number; obj: { test: "test"; deep: { property: string } } }
  >
>;

type _optionalNestedPropertySelection = Select<TestSchema, { optionalObj: { test: true } }>;
type _TestSelectingOptionalNestedProperties = AssertTrue<
  IsExact<_optionalNestedPropertySelection, { optionalObj: { test: "test" } | null }>
>;

type _listSelection = Select<TestSchema, { list: { stuff: true } }>;
type _TestSelectingLists = AssertTrue<IsExact<_listSelection, { list: { stuff: number[] | null }[] }>>;

type _optionalListSelection = Select<TestSchema, { optionalList: { stuff: true; title: true } }>;
type _TestSelectingOptionalLists = AssertTrue<
  IsExact<_optionalListSelection, { optionalList: { title: "listy"; stuff: number[] | null }[] | null }>
>;

type _connectionSelection = Select<
  TestSchema,
  { someConnection: { pageInfo: { hasNextPage: true }; edges: { node: { id: true; state: true } } } }
>;
type _TestSelectingConnection = AssertTrue<
  IsExact<
    _connectionSelection,
    {
      someConnection: {
        pageInfo: { hasNextPage: boolean };
        edges: ({ node: { id: string; state: string } | null } | null)[] | null;
      };
    }
  >
>;

test("true", () => undefined);
