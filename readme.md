# markdown-content-blocks [![Build Status](https://travis-ci.org/phortuin/markdown-content-blocks.svg?branch=master)](https://travis-ci.org/phortuin/markdown-content-blocks)

> Parses content blocks into Markdown

Inspired by iA Writer’s content blocks, a file transclusion syntax for Markdown, as [specced here](https://github.com/iainc/Markdown-Content-Blocks).

## Install

```bash
$ npm install markdown-content-blocks
```

## Usage

```javascript
const contentBlocks = require('markdown-content-blocks')

let source = `
# Title

/example.js
/moretext.txt
`

let files = {
	'example.js': `console.log('Hello World');`,
	'moretext.txt': 'Here be text'
}

let markdown = contentBlocks(source, files)

// # Title
//
// ```javascript
// console.log('Hello World');
// ```
//
// Here be text
```

## Shortcomings

- Doesn’t embed `.csv` files as tables
- Doesn’t syntax highlight everything mentioned in [iA’s spec](https://github.com/iainc/Markdown-Content-Blocks/blob/develop/Languages.json) (instead, it does most of what [Prism.js](https://prismjs.com/#languages-list) supports)

## License
[MIT](license) © [Anne Fortuin](https://phortuin.nl/)
