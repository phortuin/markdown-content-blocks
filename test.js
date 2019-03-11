const test = require('tape')
const contentBlocks = require('./')

const replacements = {
	'example.js': `console.log('Hello World');`,
	'moretext.txt': 'Here be text'
}

const markdown = `
# Title

/example.js
/moretext.txt
/https://i.imgur.com/p66zLsr.jpg
`

const output = `
# Title

\`\`\`javascript
console.log('Hello World');
\`\`\`

Here be text

![](https://i.imgur.com/p66zLsr.jpg "")
`

const blocks = [
	'example.js',
	'moretext.txt',
]

test('Parses markdown', t => {
	t.plan(1)
	t.equal(contentBlocks(markdown, replacements), output)
})

test('Gets list of required content blocks', t => {
	t.plan(1)
	t.deepEqual(contentBlocks.getBlocks(markdown), blocks)
})
