import { cat, test } from 'shelljs';
import { link, run, unlink, UnlinkVersion } from '../src';
import { forceDependenciesLatest, ForceLatestDependenciesResult } from '../src/force-dependency';
import { flattenDeep } from '../src/util';
import { exec0, initializeProject1 } from './testUtil';

describe('API', () => {

	initializeProject1()
	describe('unlink', () => {
		initializeProject1()

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
	})

	describe('unlink', () => {
		xit('link', () => {
		})
	})

	describe('run by default run all commands no matter if there are erros', () => {
		initializeProject1()
		it('run breakOnError=false should execute all commands no matter if some ends with error', async done => {
			const result = await run({ rootPath: 'project1', cmd: 'echo "hello" && exit 1', breakOnError: false })
			expect(result.length).toBe(3)
			expect(result.filter(r => r.stdout.includes('hello')).length).toBe(3)
			expect(result.filter(r => r.code === 1).length).toBe(3)
			done()
		})

		it('run breakOnError: true, exitOnBreak: false', async done => {
			const result = await run({ rootPath: 'project1', cmd: 'echo "hello" && exit 1', breakOnError: true, exitOnBreak: false })
			expect(result.length).toBe(1)
			expect(result.filter(r => r.stdout.includes('hello')).length).toBe(1)
			expect(result.filter(r => r.code === 1).length).toBe(1)
			done()
		})
	})

	describe('forceDependenciesLatest', () => {
		initializeProject1()
		it('yamat forceDependenciesLatest should work when executing in a yamat mono-repo root project and update dependencies of all its children', async done => {
			exec0(`cd project1/foo && npm i --save hrtime-now@1.0.0`)
			expect(JSON.parse(cat('project1/foo/package.json')).dependencies['hrtime-now']).toContain('1.0.0')
			const results = await forceDependenciesLatest({
				rootPath: './project1', exclude: 'none', excludeDependencies: []
			})
			expect(JSON.parse(cat('project1/foo/package.json')).dependencies['hrtime-now']).not.toContain('1.0.0')
			expect(flattenDeep(results).find((r: ForceLatestDependenciesResult) => r.package === 'hrtime-now')!.oldVersion).toContain('1.0.0')
			done()
		})

		it('yamat forceDependenciesLatest should work even without yamat.json only updating current folder project', async done => {
			exec0(`
			rm -rf project1/withoutYamatJson && 
			mkdir -p project1/withoutYamatJson && 
			cd project1/withoutYamatJson && 
			npm init -y && 
			npm i --save hrtime-now@1.0.0
			`)
			expect(JSON.parse(cat('project1/withoutYamatJson/package.json')).dependencies['hrtime-now']).toContain('1.0.0')

			exec0(`cd project1/withoutYamatJson && npm i -D ../..`)
			const results = await forceDependenciesLatest({
				rootPath: 'project1/withoutYamatJson', exclude: 'none', excludeDependencies: []
			})
			expect(JSON.parse(cat('project1/withoutYamatJson/package.json')).dependencies['hrtime-now']).not.toContain('1.0.0')
			expect(flattenDeep(results).find((r: ForceLatestDependenciesResult) => r.package === 'hrtime-now')!.oldVersion).toContain('1.0.0')
			done()
		})
	})
})
