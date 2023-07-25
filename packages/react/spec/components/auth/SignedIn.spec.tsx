import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { SignedIn } from "../../../src/components/auth/SignedIn.js";
import { superAuthApi } from "../../apis.js";
import { TestWrapper } from "../../testWrapper.js";
import { expectMockDeletedUser, expectMockSignedInUser, expectMockSignedOutUser } from "../../utils.js";

describe("SignedIn", () => {
  test("renders children when signed in", () => {
    const component = (
      <h1>
        Hello<SignedIn>, Jane!</SignedIn>
      </h1>
    );

    const { container, rerender } = render(component, { wrapper: TestWrapper(superAuthApi) });

    expectMockSignedInUser();

    rerender(component);

    expect(container.outerHTML).toMatchInlineSnapshot(`"<div><h1>Hello, Jane!</h1></div>"`);
  });

  test("renders nothing when signed out", () => {
    const component = (
      <h1>
        Hello<SignedIn>, Jane!</SignedIn>
      </h1>
    );

    const { container, rerender } = render(component, { wrapper: TestWrapper(superAuthApi) });

    expectMockSignedOutUser();
    rerender(component);
    expect(container.outerHTML).toMatchInlineSnapshot(`"<div><h1>Hello</h1></div>"`);
  });

  test("renders nothing when signed in but has no user on the session", () => {
    const component = (
      <h1>
        Hello<SignedIn>, Jane!</SignedIn>
      </h1>
    );

    const { container, rerender } = render(component, { wrapper: TestWrapper(superAuthApi) });

    expectMockDeletedUser();
    rerender(component);
    expect(container.outerHTML).toMatchInlineSnapshot(`"<div><h1>Hello</h1></div>"`);
  });
});
