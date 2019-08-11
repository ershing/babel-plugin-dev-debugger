
export default function ({ types: t }) {
  let pluginState = {
    libraryName: 'dev-debugger',
    replaceFns: ['debugVal', 'debugCaseTag'],
    replaceFnLocalNamesObj: {},
    libraryLocalName: '',
    instanceName: ''
  }

  function findVariableConnect(path, replaceFn) {
    while (!t.isVariableDeclarator(path.node)) {
      path = path.parentPath
    }
    const { node } = path
    if (t.isIdentifier(node.id)) {
      pluginState.replaceFnLocalNamesObj[node.id.name] = replaceFn
      path.remove()
    }
  }

  function controlCallMemberExpression(path, node, callee) {
    if (callee && t.isMemberExpression(callee.object) && t.isIdentifier(callee.property)
      && callee.property.name === 'bind' && t.isIdentifier(node.arguments[0])
      && node.arguments[0].name === pluginState.instanceName) {
      controlCallMemberExpression(path, callee.object)
    }

    callee = callee || node

    if (t.isIdentifier(callee.object) && callee.object.name === pluginState.instanceName && t.isIdentifier(callee.property)) {
      if (~pluginState.replaceFns.indexOf(callee.property.name)) {
        node === callee ? findVariableConnect(path, callee.property.name) : path.replaceWith(node.arguments[0])
      }
    }
  }

  return {
    visitor: {

      ImportDeclaration(path) {
        const { node } = path;
        if (!node) return;
        const { value } = node.source;
        if (value === pluginState.libraryName) {
          node.specifiers.forEach(spec => {
            if (t.isImportDefaultSpecifier(spec)) {
              pluginState.libraryLocalName = spec.local.name;
            }
          });
          path.remove()
        }
      },

      NewExpression(path) {
        const { node } = path
        if (!node) return;
        if (t.isIdentifier(node.callee) && pluginState.libraryLocalName && node.callee.name === pluginState.libraryLocalName) {
          if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
            pluginState.instanceName = path.parent.id.name
          }
          if (t.isVariableDeclarator(path.parent)) {
            path.parentPath.remove()
          } else {
            path.remove()
          }
        }
      },

      CallExpression(path) {
        const { node } = path;
        const { callee } = node
        if (t.isMemberExpression(callee)) {
          controlCallMemberExpression(path, node, callee)
        } else if (t.isIdentifier(callee) && pluginState.replaceFnLocalNamesObj[callee.name]) {
          path.replaceWith(node.arguments[0])
        }
      },
    }
  }
}