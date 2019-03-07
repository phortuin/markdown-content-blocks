const languages = {
	sh: "bash",
	cpp: "cpp",
	css: "css",
	diff: "diff",
	js: "javascript",
	php: "clike",
	rb: "ruby",
}
const imageExtensions = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'tif',
	'tiff',
	'svg',
]
const textExtensions = [
	'md',
	'txt',
]

function isImage(extension) {
	return imageExtensions.includes(extension)
}

function isText(extension) {
	return textExtensions.includes(extension)
}

function isCode(extension) {
	return Object.keys(languages).includes(extension)
}

function codeBlock(language, content) {
	return `\`\`\`${language}\n${content}\n\`\`\`\n`
}

function image(url, alt, title) {
	return `![${alt}](${url} "${title}")`
}

function unwrap(string) {
	return string ? string.slice(1, -1) : ''
}

function analyzeBlock(string) {
	let matches = string.match(/(.+)\.([\S]+)\s*(["\(].+["\)])?/m)
	if (matches) {
		let [ fullMatch, filename, extension, title ] = matches
		if (isImage(extension)) {
			return { type: 'replace', block: string, replacement: image(`${filename}.${extension}`, '', unwrap(title)) }
		}
		if (isText(extension)) {
			return { type: 'text', block: string, filename: `${filename}.${extension}` }
		}
		if (isCode(extension)) {
			return { type: 'code', block: string, filename: `${filename}.${extension}`, replacement: content => codeBlock(languages[extension], content) }
		}
	}
	return string
}

/**
 * @param  {Object} markdown
 * @param  {Object} files
 * @return {String}
 */
module.exports = function replaceContentBlocks(markdown, files) {
	let regex = /^\/(.+)$/gm
	let results = []
	while ((results = regex.exec(markdown)) !== null) {
		let contentBlock = analyzeBlock(results[1])
		switch (contentBlock.type) {
			case 'replace':
				markdown = markdown.replace(`/${contentBlock.block}`, contentBlock.replacement)
				break
			case 'text':
				markdown = markdown.replace(`/${contentBlock.block}`, `${files[contentBlock.filename]}\n`)
				break
			case 'code':
				markdown = markdown.replace(`/${contentBlock.block}`, contentBlock.replacement(files[contentBlock.filename]))
				break
		}
	}
	return markdown
}
