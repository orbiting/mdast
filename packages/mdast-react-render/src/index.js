import React from 'react'

const DefaultMissingNode = ({node, children}) => (
  <span style={{background: '#FF5555', color: '#FFFFFF', display: 'inline-block', margin: 4}}>
    Missing Markdown node type "{node.type}"
    {node.identifier ? `with identifier "${node.identifier}"` : ''}
    {' '}
    {children}
  </span>
)

export const renderMdast = (mdast, schema, options = {}) => {
  const {parent = null, MissingNode = DefaultMissingNode} = options

  const rules = schema.rules.filter(rule => rule.matchMdast && rule.component)

  const visit = (node, index, nodeParent) => {
    if (node.type === 'text') {
      return node.value
    }

    const rule = rules.find(r => r.matchMdast(node, index, nodeParent))
    if (!rule) {
      if (!MissingNode) {
        throw new Error([
          `Missing Rule for Markdown node type "${node.type}"`,
          node.identifier ? `with identifier "${node.identifier}"` : '',
          'Note: A valid rules needs an renderMdast and component function'
        ].join(' '))
      }
      return (
        <MissingNode key={index} node={node}>
          {visitChildren(node)}
        </MissingNode>
      )
    }

    const Component = rule.component

    let props
    if (rule.props) {
      props = rule.props(node, index, nodeParent)
    } else {
      props = {
        data: node.data
      }
    }

    let children = null
    if (rule.rules) {
      children = renderMdast(
        node.children,
        {
          rules: rule.rules
        },
        {
          ...options,
          parent: node
        }
      )
    } else if (!rule.isVoid) {
      children = visitChildren(node)
    }

    return (
      <Component key={index} {...props}>
        {children}
      </Component>
    )
  }

  const visitArray = (array, nodeParent) => {
    return array.map((item, index) => visit(item, index, nodeParent))
  }

  const visitChildren = (node) => {
    if (!node.children || node.children.length === 0) {
      return null
    }
    return visitArray(node.children, node)
  }

  return Array.isArray(mdast)
    ? visitArray(mdast, parent)
    : visit(mdast, 0, parent)
}
