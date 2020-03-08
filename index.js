const { join: joinPath } = require('path')

const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff', 'svg']
const languages = {
	sh: "bash",
	cpp: "cpp",
	css: "css",
	diff: "diff",
	js: "javascript",
	php: "clike",
	rb: "ruby",
}
const DEFAULTS = {
	imagePath: '/'
}

const create = () => {

	function contentBlocks(markdown, blocks, options) {
		options = Object.assign({}, DEFAULTS, options)
		return contentBlocks.replace(markdown, blocks, options)
	}

	contentBlocks.replace = (markdown, blocks, options) => {
		getBlocks(markdown, options).forEach(block => {
			let content = blocks[block.path]
			markdown = markdown.replace(block.match, block.replacer(content))
		})
		return markdown.replace(/\n{2,}$/, '\n')
	}

	contentBlocks.getBlocks = markdown => {
		return getBlocks(markdown)
			.filter(block => !block.isImage)
			.map(block => block.path)
	}

	function getBlocks(markdown, options = {}) {
		let regex = /^\/.+$/gm
		let blocks = []
		while ((results = regex.exec(markdown)) !== null) {
			let block = populateBlock(results[0], options.imagePath)
			blocks.push(block)
		}
		return blocks
	}

	function populateBlock(blockString, imagePath) {
		let matches = blockString.match(/\/(.+\.([\S]+))\s*(["\(].+["\)])?/m)
		let block = {}
		if (matches) {
			let [ match, path, extension, title ] = matches
			let isImage = imageExtensions.includes(extension)
			let isCode = Object.keys(languages).includes(extension)
			block = {
				match,
				path,
				extension,
				title,
				isImage,
				replacer: content => {
					if (isImage) return `![](${getImageURI(block, imagePath)} "${sanitizeTitle(block.title)}")\n\n`
					if (isCode) return `\`\`\`${languages[block.extension]}\n${content}\n\`\`\`\n\n`
					return content ? `${content}\n\n` : ''
				}
			}
		}
		return block
	}

	function sanitizeTitle(title) {
		if (typeof title === 'string') {
			return title.replace(/[("]?([^")]+)[)"]?/, '$1').trim()
		} else {
			return ''
		}
	}

	function getImageURI(block, imagePath) {
		return block.path.startsWith('http') ?
			block.path :
			joinPath(imagePath, block.path)
	}

	return contentBlocks
}

module.exports = create()
