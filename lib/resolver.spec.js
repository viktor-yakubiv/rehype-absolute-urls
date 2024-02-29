import { resolveBase, resolveRelative } from './resolver.js'

describe('resolveRelative', () => {
	it('does not cross the root', () => {
		expect(resolveRelative('/', '../')).toBe('/')
		expect(resolveRelative('/', '../../')).toBe('/')
		expect(resolveRelative('/', './../')).toBe('/')
	})

	it('does not leack internal fake host', () => {
		expect(resolveRelative('/home/index.html', './')).toBe('/home/')
	})

	it('treats `from` with omitted trailing slash as root', () => {
		expect(resolveRelative('home/index.html', './')).toBe('/home/')
	})

	it('respects absolute URLs', () => {
		const website = 'https://yakubiv.com'
		// URL adds a slash at the end
		const expectedWebsite = website.replace(/\/?$/, '/')

		expect(resolveRelative('/', website)).toBe(expectedWebsite)
	})

	it('respects query parameters and hash', () => {
		const to = '/contact?ref=email#message'
		expect(resolveRelative('/home', to)).toBe(to)
	})

	it('handles query string only properly', () => {
		expect(resolveRelative('/search', '?q=s')).toBe('/search?q=s')
	})

	it('handles hash only properly', () => {
		expect(resolveRelative('/home', '#contacts')).toBe('/home#contacts')
	})
})

describe('resolveBase', () => {
	it('throws if target is not inside source root', () => {
		expect(() => resolveBase('/tmp/file', '/var/'))
			.toThrow('path must be inside')
	})

	it('removes local source directory path properly', () => {
		expect(resolveBase('/app/src/contacts/index.html', '/app/src/')).toBe('/contacts/index.html')
	})

	it('works with relative paths based on CWD', () => {
		expect(resolveBase('./src/index.html', './src')).toBe('/index.html')
	})

	it('supports custom public base path', () => {
		expect(resolveBase('/app/contacts', '/app', '/public'))
			.toBe('/public/contacts')
	})
})
