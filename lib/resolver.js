import {
	resolve as resolvePath,
	relative as relativePath,
} from 'node:path'

const FAKE_HOST = (Math.random()).toString(36).slice(2) + '.fake'
const FAKE_ORIGIN = 'https://' + FAKE_HOST

/**
 * Resolves public file URL based on local directory to public location
 * association
 * 
 * @param {string} target - file path to resolve public URL for
 * @param {string} [sourceRoot = './'] - local subpath that is replaced
 * with the public (sub)-path
 * @param {string} [publicBase = '/'] - base public path
 */
export function resolveBase(target, sourceRoot = './', publicBase = '/') {
	if (relativePath(sourceRoot, target).startsWith('..')) {
		throw new Error('Target path must be inside source root directory')
	}

	sourceRoot = resolvePath(sourceRoot.replace(/\/*$/, ''))
	publicBase = publicBase.replace(/\/*$/, '/')
	target = resolvePath(target)

	const sourceRootUrl = new URL(`file://${sourceRoot}`)
	const publicRootUrl = new URL(publicBase, FAKE_ORIGIN)

	const localFileUrl = new URL(`file://${target}`)
	const publicFileUrl = new URL(localFileUrl.href
		.replace(new RegExp(`^${sourceRootUrl}/`), publicRootUrl))

	return publicFileUrl.href.slice(FAKE_ORIGIN.length)
}

/**
 * @param {string} from - public URL-compativle path to resolve from
 * @param {string} to - a URL to resolve to
 */
export function resolveRelative(from, to) {
	const baseUrl = new URL(from, FAKE_ORIGIN)
	const targetUrl = new URL(to, baseUrl)
	return targetUrl.href.startsWith(FAKE_ORIGIN)
		? targetUrl.href.slice(FAKE_ORIGIN.length)
		: targetUrl.href
}
