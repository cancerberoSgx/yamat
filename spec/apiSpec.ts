import { cat, test } from 'shelljs';
import { link, run, unlink, UnlinkVersion } from '../src';
import { performBeforeAll } from './testUtil';

describe('API', () => {

	performBeforeAll()

	it('unlink', () => {
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toBe("file:../bar")
		unlink({ rootPath: 'project1' })
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toBe("1.0.0")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toBe("1.0.0")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toBe("1.0.0")
		link({ rootPath: 'project1' })
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toBe("file:../bar")
	})

	it('unlink --version pack', () => {
		unlink({ rootPath: 'project1', version: UnlinkVersion.pack })
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toContain("project1/.yamat/foo-1.0.0.tgz")
		expect(test('-f', JSON.parse(cat('project1/bar/package.json')).dependencies.foo)).toBe(true)
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toContain("project1/.yamat/foo-1.0.0.tgz")
		expect(test('-f', JSON.parse(cat('project1/third/package.json')).dependencies.foo)).toBe(true)
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toContain("project1/.yamat/bar-1.0.0.tgz")
		expect(test('-f', JSON.parse(cat('project1/third/package.json')).dependencies.bar)).toBe(true)
	})

	xit('link', () => {
	})

	it('run', () => {
		run({ rootPath: 'project1', cmd: 'echo "hello" && exit 0', breakOnError: true })
		// TODO: expect here ? 
	})
	xit('run --breakOnError=true', () => {
	})

})
