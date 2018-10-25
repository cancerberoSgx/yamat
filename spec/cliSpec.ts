import { cat, exec } from 'shelljs';

describe('CLI', () => {

	it('yamat run', () => {
		const p = exec(`\\
cd project1
npm i --save-dev ..
npx yamat run  'echo "hello123" && exit 0' 
		`)
		expect(p.code).toBe(0)
		expect(p.stdout).toContain('hello123')
	})

	xit('yamat run --breakOnError=true', () => {
	})

	it('yamat forceDependenciesLatest', () => {
		const p = exec(`\\
cd project1/foo && \\
npm i --save hrtime-now@1.0.0 && \\
cd .. && \\
npx yamat forceDependenciesLatest && \\
cd ..
		`)
		expect(p.code).toBe(0)
		const dependencies = JSON.parse(cat('project1/foo/package.json')).dependencies
		expect(dependencies['hrtime-now']).not.toBe('1.0.0')
	})

	xit('yamat forceDependenciesLatest --exclude --excludeDependencies', () => {

	})

	// TODO: CLI - test other commands
})
