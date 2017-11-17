import React from 'react'

const DefaultMissingNode = ({node, children}) => (
  <span style={{background: '#FF5555', color: '#FFFFFF', display: 'inline-block', margin: 4}}>
    Missing Markdown node type "{node.type}"
    {node.identifier ? `with identifier "${node.identifier}"` : ''}
    {' '}
    {children}
  </span>
)

export const renderMdast = (mdast, schema = {}, MissingNode = DefaultMissingNode) => {
  const rules = schema.rules.filter(rule => rule.matchMdast && rule.component)

  const visit = (node, index, parent) => {
    if (node.type === 'text') {
      return node.value
    }

    const rule = rules.find(r => r.matchMdast(node, index, parent))
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

    const data = rule.getData
      ? rule.getData(node, parent)
      : (node.data || {})

    let children = null
    if (rule.rules) {
      children = renderMdast(
        node.children, {
          rules: rule.rules
        }
      )
    } else if (!rule.isVoid) {
      children = visitChildren(node)
    }

    return (
      <Component key={index} data={data}>
        {children}
      </Component>
    )
  }

  const visitArray = (array, parent) => {
    return array.map((item, index) => visit(item, index, parent))
  }

  const visitChildren = (node) => {
    if (!node.children || node.children.length === 0) {
      return null
    }
    return visitArray(node.children, node)
  }

  return Array.isArray(mdast)
    ? visitArray(mdast, null)
    : visit(mdast, 0, null)
}
