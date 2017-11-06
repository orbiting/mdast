import React from 'react'
import ReactDOMServer from 'react-dom/server'

import { renderMdast } from './render'

export const Mso = ({children, gte}) =>
  <mso data-gte={gte} dangerouslySetInnerHTML={{
    __html: children
  }} />

const DOCTYPE = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'

export const renderEmail = (mdast, schema = {}) => (
  DOCTYPE +
  ReactDOMServer.renderToStaticMarkup(
    renderMdast(mdast, schema)
  )
    .split('<mso>')
    .join('<!--[if mso]>')
    .replace(
      /<mso data-gte="([^""]+)">/,
      (match, gte) => `<!--[if gte mso ${gte}]>`
    )
    .split('</mso>')
    .join('<![endif]-->')
)
