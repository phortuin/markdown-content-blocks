const test = require('tape')
const contentBlocks = require('./')

const replacements = {
	'example.js': `console.log('Hello World');`,
	'moretext.txt': 'Here be text'
}

const partialReplacements = {
	'example.js': `console.log('Hello World');`
}

const markdown = `
# Title

/example.js
/moretext.txt
/https://i.imgur.com/p66zLsr.jpg
`

const markdownLocalImage = `
# Title

/mylogo.jpg
`

const output = `
# Title

\`\`\`javascript
console.log('Hello World');
\`\`\`

Here be text

![](https://i.imgur.com/p66zLsr.jpg "")
`

const alternateOutput = `
# Title

\`\`\`javascript
console.log('Hello World');
\`\`\`

![](https://i.imgur.com/p66zLsr.jpg "")
`

const outputLocalImage = `
# Title

![](/mylogo.jpg "")
`

const outputLocalImageAlternate = `
# Title

![](/media/mylogo.jpg "")
`

const blocks = [
	'example.js',
	'moretext.txt',
]

const options = {
	imagePath: '/media'
}

test('Parses markdown', t => {
	t.plan(1)
	t.equal(contentBlocks(markdown, replacements), output)
})

test('Gets list of required content blocks', t => {
	t.plan(1)
	t.deepEqual(contentBlocks.getBlocks(markdown), blocks)
})

test('Removes content block from markdown if no content is given', t => {
	t.plan(1)
	t.equal(contentBlocks(markdown, partialReplacements), alternateOutput)
})

test('Local image gets build folder path prefix', t => {
	t.plan(2)
	t.equal(contentBlocks(markdownLocalImage, {}), outputLocalImage)
	t.equal(contentBlocks(markdownLocalImage, {}, options), outputLocalImageAlternate)
})
