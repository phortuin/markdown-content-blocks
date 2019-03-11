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
/https://i.imgur.com/p66zLsr.jpg
`

let blocks = {
	'example.js': `console.log('Hello World');`,
	'moretext.txt': 'Here be text'
}

let markdown = contentBlocks(source, blocks)

// # Title
//
// ```javascript
// console.log('Hello World');
// ```
//
// Here be text
//
// ![](https://i.imgur.com/p66zLsr.jpg "")
```

## API

### contentBlocks(markdown, blocks)

### contentBlocks.replace(markdown, blocks)

Returns a Markdown string.

#### markdown

Type: `string`

Markdown string to be parsed.

#### blocks

Type: `object`

Key/value pairs where the key is the content block (a file name or path) that should be replaced; value is the replacement value:

```javascript
let blocks = {
	'example.js': `console.log('Hello World');`,
	'moretext.txt': 'Here be text'
}
```

### contentBlocks.getBlocks(markdown)

Returns an array of content blocks (file names or paths) that were found in the given Markdown string.

**Note:** content blocks that appear to be images are ignored.

```javascript
let blocks = contentBlocks.getBlocks(source) //=> ['example.js', 'moretext.txt']
```

#### markdown

Type: `string`

## Notes

- Doesn’t embed `.csv` content blocks as tables
- Doesn’t syntax highlight everything mentioned in [iA’s spec](https://github.com/iainc/Markdown-Content-Blocks/blob/develop/Languages.json) (instead, it does most of what [Prism.js](https://prismjs.com/#languages-list) supports)
- Replaces anything resembling an image URL with an image block `![]()` and optionally empty title. No `alt` text is supported as of now; the iA Writer 'spec' is lacking in this regard. Therefore no source file is needed for an image block, as it is regarded to contain a live image URL.
- Ignores titles for code blocks, as there is no Markdown syntax for titles/captions for (fenced) code blocks. Same goes for text blocks (`.md` and `.txt`).

## License
[MIT](license) © [Anne Fortuin](https://phortuin.nl/)
