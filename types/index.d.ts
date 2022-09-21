/**
 * Importing auto generated types declarations.
 */
export = $mvc;
export as namespace $mvc;

declare namespace $mvc {
    const Component: typeof import("../dist/src/component").Component;
    const Container: typeof import("../dist/src/container").Container;
    const Context: typeof import("../dist/src/context").Context;
    const Element: typeof import("../dist/src/element").Element;
    const Factory: typeof import("../dist/src/factory").Factory;
    const JsxElement: typeof import("../dist/src/jsx-element").JsxElement;
    const Model: typeof import("../dist/src/model").Model;
    const View: typeof import("../dist/src/view").View;
}
