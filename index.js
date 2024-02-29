import { hasProperty as has } from 'hast-util-has-property'
import { visit } from 'unist-util-visit'
import { resolveBase, resolveRelative } from './lib/resolver.js'

/**
	* @typedef {Object} Options
	* @property {string} [sourceRootPath = './']
	* @property {string} [publicRootPath = '/']
	*/

/**
 * @param {Options} options
 */
function attachPlugin(options) {
	return (tree, file) => transformUrls(tree, file, options)
}

/**
 * @param {Root} tree
 * @param {VFileCompatible} file
 * @param {Options} options
 */
function transformUrls(tree, file, options = {}) {
	const { sourceRootPath, publicRootPath } = options
	const baseHref = resolveBase(file.path, sourceRootPath, publicRootPath)

	const modify = (node, prop) => {
		if (!has(node, prop)) {
			return
		}

		if (node.properties[prop].startsWith('#')) {
			return
		}

		const localHref = node.properties[prop]
		const publicHref = resolveRelative(baseHref, localHref)
		node.properties[prop] = publicHref
	}

	visit(tree, 'element', (node) => {
		modify(node, 'href')
		modify(node, 'src')
	})
}

export default attachPlugin
