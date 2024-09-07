export function getDeepestChildren(parent: Element): Element[] {
  return Array.from(parent.children).reduce((acc, node) => {
    const children = Array.from(node.children);

    if (children.length === 0) {
      acc.push(node);

      return acc;
    }

    return [...acc, ...getDeepestChildren(node)];
  }, [] as Element[]);
}

export function getElementByXpath(path: string) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
