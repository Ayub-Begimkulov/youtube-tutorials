import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => "asdf.com/" + name);

createRule({
  name: "no-dick-pick",
  create(context) {
    return {
      TSEnumDeclaration(node) {
        if (node.const) {
          context.report({
            messageId: "constError",
            node: node.id,
          });
          return;
        }

        const isLiteralStringMembers = node.members.every(
          (member) =>
            member.initializer?.type === AST_NODE_TYPES.Literal &&
            typeof member.initializer.value === "string"
        );

        if (!isLiteralStringMembers) {
          context.report({
            messageId: "",
          });
        }
      },
    };
  },
  meta: {
    docs: {
      recommended: "error",
      description: "a rule to check that you write your enums correctly",
    },
    schema: {},
    type: "problem",
    messages: {
      constError: "you should not use const enums",
    },
  },
  defaultOptions: [],
});
