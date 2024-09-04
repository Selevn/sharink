function getDeepestChildren (parent)  {
    return Array.from(parent.children).reduce((acc, node) => {
      const children = Array.from(node.children);

      if (children.length === 0) {
        acc.push(node);

        return acc;
      }

      return [...acc, ...getDeepestChildren(node)];
    }, []);
};

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}