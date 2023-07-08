import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

export const strictEnumRule = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    messages: {
      noConstEnum: "can not use const enums",
      literalMembers: "can not use non literal member in enum",
      noNonStringMembers: "can not use non string members in enum",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSEnumDeclaration(node) {
        if (node.const) {
          context.report({
            node,
            messageId: "noConstEnum",
          });
        }
      },
      TSEnumMember(node) {
        if (node.initializer?.type !== AST_NODE_TYPES.Literal) {
          return context.report({
            node,
            messageId: "literalMembers",
          });
        }

        if (typeof node.initializer.value !== "string") {
          return context.report({
            node,
            messageId: "noNonStringMembers",
          });
        }
      },
    };
  },
});
