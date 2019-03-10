const test = require('tape')
const contentBlocks = require('./')

const files = {
	'example.js': `console.log('Hello World');`,
	'moretext.txt': 'Here be text'
}

const source = `
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

![](https://i.imgur.com/p66zLsr.jpg)
`

const fileList = [
	'example.js',
	'moretext.txt',
]

test('Parses markdown', t => {
	t.plan(1)
	t.equal(contentBlocks(source, files), output)
})

test('Gets required file list', t => {
	t.plan(1)
	t.deepEqual(contentBlocks.getFiles(source), fileList)
})
