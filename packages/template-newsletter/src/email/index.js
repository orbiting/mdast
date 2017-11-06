import Container from './Container'
import Cover, {Title, Lead} from './Cover'
import Paragraph, {Strong, Em, Link, Br} from './Paragraph'
import Center from './Center'
import { H2, H3 } from './Headlines'
import Figure, { Image, Caption } from './Figure'
import Blockquote from './Blockquote'
import List, { ListItem } from './List'

import {
  matchType,
  matchZone,
  matchHeading,
  matchParagraph,
  matchImageParagraph
} from 'mdast-react-render/lib/utils'

const paragraph = {
  matchMdast: matchParagraph,
  component: Paragraph,
  rules: [
    {
      matchMdast: matchType('break'),
      component: Br,
      isVoid: true
    },
    {
      matchMdast: matchType('strong'),
      component: Strong
    },
    {
      matchMdast: matchType('emphasis'),
      component: Em
    },
    {
      matchMdast: matchType('link'),
      getData: node => ({
        title: node.title,
        href: node.url
      }),
      component: Link
    }
  ]
}

const schema = {
  rules: [
    {
      matchMdast: matchType('root'),
      component: Container,
      rules: [
        {
          matchMdast: matchZone('COVER'),
          component: Cover,
          getData: node => {
            const img = node.children[0].children[0]
            return {
              alt: img.alt,
              src: img.url
            }
          },
          rules: [
            {
              matchMdast: matchImageParagraph,
              component: () => null,
              isVoid: true
            },
            {
              matchMdast: matchHeading(1),
              component: Title
            },
            {
              matchMdast: matchType('paragraph'),
              component: Lead,
              rules: paragraph.rules
            }
          ]
        },
        {
          matchMdast: matchZone('CENTER'),
          component: Center,
          rules: [
            paragraph,
            {
              matchMdast: matchHeading(2),
              component: H2
            },
            {
              matchMdast: matchHeading(3),
              component: H3
            },
            {
              matchMdast: matchZone('FIGURE'),
              component: Figure,
              rules: [
                {
                  matchMdast: matchImageParagraph,
                  component: Image,
                  getData: node => ({
                    src: node.children[0].url,
                    alt: node.children[0].alt
                  }),
                  isVoid: true
                },
                {
                  matchMdast: matchParagraph,
                  component: Caption,
                  getData: (node, parent) => (parent && parent.data) || {},
                  rules: paragraph.rules
                }
              ]
            },
            {
              matchMdast: matchType('blockquote'),
              component: Blockquote,
              rules: [
                paragraph
              ]
            },
            {
              matchMdast: matchType('list'),
              component: List,
              getData: node => ({
                ordered: node.ordered,
                start: node.start
              }),
              rules: [
                {
                  matchMdast: matchType('listItem'),
                  component: ListItem,
                  rules: [paragraph]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export default schema
module.exports = schema
