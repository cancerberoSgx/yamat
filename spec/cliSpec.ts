import { cat, config } from 'shelljs';
import { exec0, initializeProject1 } from './testUtil';

describe('CLI', () => {

	describe('run', () => {

		initializeProject1('beforeAll')
		it('run on yamat project if there are no errors must run for all projects', () => {

			const p = exec0(`cd project1 && npm i --save-dev .. && npx yamat run 'echo "hello123"'`)
			expect(p.stdout.split('hello123').length).toBeGreaterThanOrEqual(3)
		})

		it('run --breakOnError true --exitOnError false', () => {
			const p = exec0(`cd project1 && npm i --save-dev ..  && npx yamat --breakOnError true --exitOnError false run echo "hello99" && exit 1`, false)
			// expect(p.stdout.split('hello123').length).toBeLessThanOrEqual(2)
			expect(p.code).toBe(1)
		})
	})

	describe('forceDependenciesLatest', () => {
		initializeProject1('beforeAll')
		it('yamat forceDependenciesLatest executed in a yamat project should update dependencies of all its children', () => {
			exec0(`cd project1/foo && npm i --save hrtime-now@1.0.0`)
			expect(JSON.parse(cat('project1/foo/package.json')).dependencies['hrtime-now']).toContain('1.0.0')
			exec0(`cd project1 && npm i -D .. && npx yamat forceDependenciesLatest`)
			expect(JSON.parse(cat('project1/foo/package.json')).dependencies['hrtime-now']).not.toContain('1.0.0')
		})

		it('yamat forceDependenciesLatest executed in a project without yamat.json file should update its dependencies', () => {
			exec0(`
			rm -rf project1/withoutYamatJson && 
			mkdir -p project1/withoutYamatJson && 
			cd project1/withoutYamatJson && 
			npm init -y && 
			npm i -D ../.. && 
			npm i --save hrtime-now@1.0.0
			`)
			expect(JSON.parse(cat('project1/withoutYamatJson/package.json')).dependencies['hrtime-now']).toContain('1.0.0')
			exec0(`cd project1/withoutYamatJson && npx yamat forceDependenciesLatest`)
			expect(JSON.parse(cat('project1/withoutYamatJson/package.json')).dependencies['hrtime-now']).not.toContain('1.0.0')
		})
	})
})
