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
		traverseBlocks(markdown, (block, match) => {
			let content = files[block.path]
			markdown = markdown.replace(match, getContent(block, content))
		})
		return markdown.replace(/\n{2,}$/, '\n') // replace last multiple newlines with just one
	}

	contentBlocks.getFiles = markdown => {
		let files = []
		traverseBlocks(markdown, block => {
			if (!block.isImage) {
				files.push(block.path)
			}
		})
		return files
	}

	function getContent(block, content) {
		if (block.hasOwnProperty('replacer')) {
			if (typeof block.replacer === 'function') {
				content = block.replacer(content)
			} else {
				content = block.replacer
			}
		}
		return `${content}\n`
	}

	function sanitizeTitle(title) {
		if (typeof title === 'string') {
			return title.replace(/[("]?([^")]+)[)"]?/, '$1').trim()
		} else {
			return ''
		}
	}

	function traverseBlocks(markdown, fn) {
		let regex = /^\/.+$/gm
		let results = []
		while ((results = regex.exec(markdown)) !== null) {
			let match = results[0]
			let block = analyzeBlock(match)
			fn(block, match)
		}
	}

	function analyzeBlock(string) {
		let matches = string.match(/\/(.+\.([\S]+))\s*(["\(].+["\)])?/m)
		if (matches) {
			let [ match, path, extension, title ] = matches
			let block = {
				match,
				path,
				extension,
				isCode: Object.keys(languages).includes(extension),
				isImage: imageExtensions.includes(extension),
			}
			if (block.isImage) {
				title = sanitizeTitle(title)
				title = block.title ? ` "${block.title}"` : ''
				block.replacer = `![](${block.path}${title})`
			}
			if (block.isCode) {
				block.replacer = content => `\`\`\`${languages[block.extension]}\n${content}\n\`\`\``
			}
			return block
		}
		return string
	}

	return contentBlocks
}

module.exports = create()
