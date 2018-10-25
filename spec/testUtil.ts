import { config, exec, ExecOutputReturnValue } from 'shelljs';
import { writeFile } from '../src/util';

config.silent = false

export function performBeforeAll() {

	let p: ExecOutputReturnValue
	beforeAll(() => {
		expect(exec(`rm -rf project1 && mkdir project1 && cd project1 && npm init -y`).code).toBe(0)
		expect(exec(`\\
cd project1 && mkdir foo && cd foo && npm init -y && \\
echo "module.exports = 'from foo'"> index.js `
		).code).toBe(0)

		p = exec(`\\
cd project1 && mkdir bar && cd bar && npm init -y && npm install --save ../foo && \\
echo "console.log('foo say: '+require('foo'))"> index.js && node index.js`)
		expect(p.code).toBe(0)
		expect(p.stdout).toContain(`foo say: from foo`)

		expect(exec(`cd project1/foo &&  echo "module.exports = 'different message'"> index.js`).code).toBe(0)

		p = exec(`cd project1/bar && node index.js`)
		expect(p.code).toBe(0)
		expect(p.stdout).toContain(`foo say: different message`)

		p = exec(`\\
		cd project1/bar  && echo "module.exports.msg = 'msg from foo: '+require('foo')"> index.js && node index.js`
		)
		expect(p.code).toBe(0)

		// create other package third that depends on bar
		expect(exec(`\\
cd project1 && mkdir third && cd third && npm init -y && \\
npm install --save ../foo ../bar && \\
echo "console.log('third responds: '+require('bar').msg + ' '+ require('foo'))" > index.js `
		).code).toBe(0)
		p = exec(`\\
cd project1/third && node index.js`)
		expect(p.code).toBe(0)
		expect(p.stdout).toContain(`third responds: msg from foo: different message different message`)
		writeFile('project1/yamat.json', `
[
		{"name": "foo", "path": "./foo"}, 
		{"name": "bar", "path": "./bar"},
		{"name": "third", "path": "./third"}
]`)
	})
}
