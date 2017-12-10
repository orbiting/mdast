# Mdast Utils

This repository contains utilities we've used to combine [mdast](https://github.com/syntax-tree/mdast) and [Slate](https://github.com/ianstormtaylor/slate) in our CMS—[Publikator](https://github.com/orbiting/publikator-frontend).

## Serializer

The first challange was to convert a Slate tree to an mdast tree.

[`slate-mdast-serializer`](./packages/slate-mdast-serializer) takes care of that with customizable rules.

The API is inspired by `slate-html-serializer`—`deserialize` and `serialize` are available to convert between Slate `Value` and markdown `String`. Additionally `fromMdast` and `toMdast` is available to convert any Slate json to mdast nodes.

```js
import MarkdownSerializer from 'slate-mdast-serializer'

new MarkdownSerializer({
  rules: [
    paragraph,
    bold
  ]
})
```

- [Try it in your browser](https://runkit.com/tpreusse/slate-mdast-serializer)
- [Readme with API docs](./packages/slate-mdast-serializer) 

## Remark Preset

Preconfigured [remark](https://github.com/remarkjs/remark) with plugins for a custom `zone` type and yaml meta data.

Use this on your server if you want to persist mdast tree as strings—markdown files. In your editor to import and export markdown. Or as a helper in your test to skip writing mdast trees by hand.

```js
import { parse, stringify } from '@orbiting/remark-preset'

const md = 'Hello **World**\n'
const mdast = parse(md)

md === stringify(mdast)
```

- [Readme with API docs](./packages/remark-preset) 

## Renderer

Your front ends shouldn't load Slate or `remark` (the mdast processor) for just displaying content. Send you front end an mdast tree (as json) and let it be rendered with `react` and this under hundred-lines-of-code-long util.

[`mdast-react-render`](./packages/mdast-react-render) renders your mdast tree according to a schema.

```js
import { renderMdast } from 'mdast-react-render'

const schema = {
  rules: [{
    matchMdast: matchType('root'),
    component: Container,
    rules: [paragraph, bold]
  }]
}

renderMdast(mdast, schema)
```

- [Try it in your browser](https://runkit.com/tpreusse/mdast-react-render)
- [Readme with API docs](./packages/mdast-react-render) 

## Example Template

This isn't meant for usage but for understanding how you might use above utils and [Publikator](https://github.com/orbiting/publikator-frontend).

In `packages/template-newsletter` you'll find newsletter template schema of [Project R](https://project-r.construction/) that can render to web and email. It also contains `editor` information and can be initiated with our [CMS](https://github.com/orbiting/publikator-frontend) to author newsletters according to the schema.

- [Web schema](./packages/template-newsletter/src/web/index.js) 
- [Email schema](./packages/template-newsletter/src/email/index.js) 
