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

const create = () => {

	function contentBlocks(markdown, files) {
		return contentBlocks.replace(markdown, files)
	}

	contentBlocks.replace = (markdown, files) => {
		getBlocks(markdown).forEach(block => {
			let content = files[block.path]
			markdown = markdown.replace(block.match, block.replacer(content))
		})
		return markdown.replace(/\n{2,}$/, '\n')
	}

	contentBlocks.getFiles = markdown => {
		return getBlocks(markdown)
			.filter(block => !block.isImage)
			.map(block => block.path)
	}

	function getBlocks(markdown) {
		let regex = /^\/.+$/gm
		let blocks = []
		while ((results = regex.exec(markdown)) !== null) {
			let block = populateBlock(results[0])
			blocks.push(block)
		}
		return blocks
	}

	function populateBlock(blockString) {
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
					if (isImage) return `![](${block.path} "${sanitizeTitle(block.title)}")\n`
					if (isCode) return `\`\`\`${languages[block.extension]}\n${content}\n\`\`\`\n`
					return `${content}\n`
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

	return contentBlocks
}

module.exports = create()
