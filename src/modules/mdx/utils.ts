import { RootContent } from 'mdast'

import type { Element as HastElement, Root as HastRoot, RootContent as HastRootContent  } from 'hast';
import type { Expression, Program } from 'estree';

export function flattenNode(node: RootContent): string {
  if ('children' in node)
    return node.children.map((child) => flattenNode(child)).join('');

  if ('value' in node) return node.value;

  return '';
}


/**
 * Visit a node with filtered tag names
 */
export function visit(
  node: HastRootContent | HastRoot,
  tagNames: string[],
  handler: (node: HastElement) => 'skip' | undefined,
): void {
  if (node.type === 'element' && tagNames.includes(node.tagName)) {
    const result = handler(node);
    if (result === 'skip') return;
  }

  if ('children' in node)
    node.children.forEach((n) => {
      visit(n, tagNames, handler);
    });
}

export function createEstreeElement(
  name: string,
  attributes: object[],
  children?: unknown,
): object {
  const element: Record<string, unknown> = {
    type: 'mdxJsxFlowElement',
    name,
    attributes,
  };

  if (children) element.children = children;

  return element;
}

export function expressionToAttribute(key: string, value: Expression): object {
  return {
    type: 'mdxJsxAttribute',
    name: key,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: value,
            },
          ],
        } as Program,
      },
    },
  };
}

