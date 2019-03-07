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
	return `\`\`\`${language}\n${content}\n\`\`\``
}

function image(url, alt, title) {
	return `![${alt}](${url}${title ? ` "${title}"` : ''})`
}

function unwrap(string) {
	return string ? string.slice(1, -1) : null
}

function analyzeBlock(string) {
	let matches = string.match(/(.+\.([\S]+))\s*(["\(].+["\)])?/m)
	if (matches) {
		let [ match, path, extension, title ] = matches
		if (isImage(extension)) {
			return { match, path, replaceWith: content => image(path, '', unwrap(title)) }
		}
		if (isText(extension)) {
			return { match, path, replaceWith: content => content }
		}
		if (isCode(extension)) {
			return { match, path, replaceWith: content => codeBlock(languages[extension], content) }
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
		let block = analyzeBlock(results[1])
		markdown = markdown.replace(`/${block.match}`, block.replaceWith(files[block.path]) + '\n')
	}
	return markdown.replace(/\n{2,}$/g, '\n') // replace latest multiple newlines with just the one
}
