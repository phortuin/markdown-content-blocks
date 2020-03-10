const fs = require('fs')
const path = require('path')
const test = require('tape')
const contentBlocks = require('./')

function getFixture(name) {
	const _path = path.resolve(path.join('fixtures', name))
	return fs.readFileSync(_path).toString('utf8')
}

const blocks = {
	all: [
		'example.js',
		'moretext.txt',
	],
	partial: [
		'example.js'
	]
}

const replacements = {
	all: {
		'example.js': `console.log('Hello World');`,
		'moretext.txt': 'Here be text'
	},
	partial: {
		'example.js': `console.log('Hello World');`
	}
}

const options = {
	imagePath: '/media'
}

const input = {
	default: getFixture('in-default.md'),
	localImage: getFixture('in-localimage.md'),
	inline: getFixture('in-inline.md'),
}

const output = {
	default: getFixture('out-default.md'),
	partial: getFixture('out-partial.md'),
	localImage: getFixture('out-localimage.md'),
	localImageWithOptions: getFixture('out-localimage-with-options.md'),
	inline: getFixture('out-inline.md'),
}

test('Parses markdown', t => {
	t.plan(1)
	t.equal(contentBlocks(input.default, replacements.all), output.default)
})

test('Gets list of required content blocks', t => {
	t.plan(1)
	t.deepEqual(contentBlocks.getBlocks(input.default), blocks.all)
})

test('Removes content block from markdown if no content is given', t => {
	t.plan(1)
	t.equal(contentBlocks(input.default, replacements.partial), output.partial)
})

test('Local image gets build folder path prefix', t => {
	t.plan(2)
	t.equal(contentBlocks(input.localImage, {}), output.localImage)
	t.equal(contentBlocks(input.localImage, {}, options), output.localImageWithOptions)
})

test('Content blocks cannot be inline other text', t => {
	t.plan(2)
	t.deepEqual(contentBlocks.getBlocks(input.inline), blocks.partial)
	t.equal(contentBlocks(input.inline, replacements.all), output.inline)
})
