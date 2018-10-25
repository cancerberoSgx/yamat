import { config, exec, ExecOutputReturnValue } from 'shelljs';
import { writeFile } from '../src/util';

config.silent = false
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

export function initializeProject1(performBeforeAll: (boolean | 'beforeAll' | 'beforeEach') = true) {
	const fn = () => {

		let p: ExecOutputReturnValue

		// root project
		exec0(`rm -rf project1 && mkdir project1 && cd project1 && npm init -y`)

		//foo project
		exec0(`cd project1 && mkdir foo && cd foo && npm init -y && 
		echo "module.exports = 'from foo'"> index.js`)

		// bar project
		p = exec0(`cd project1 && mkdir bar && cd bar && npm init -y && npm install --save ../foo && 
		echo "console.log('foo say: '+require('foo'))"> index.js && node index.js`)
		expect(p.stdout).toContain(`foo say: from foo`)

		// change foo and then execute bar should have updated exported values:
		exec0(`cd project1/foo &&  echo "module.exports = 'different message'"> index.js`)
		p = exec0(`cd project1/bar && node index.js`)
		expect(p.stdout).toContain(`foo say: different message`)

		p = exec0(`cd project1/bar && 
		echo "module.exports.msg = 'msg from foo: '+require('foo')"> index.js && 
		node index.js`)

		// create other package third that depends on bar and foo
		exec0(`cd project1 && mkdir third && cd third && npm init -y && 
		npm install --save ../foo ../bar && 
		echo "console.log('third responds: '+require('bar').msg + ' '+ require('foo'))" > index.js`)

		p = exec0(`cd project1/third && node index.js`)
		expect(p.stdout).toContain(`third responds: msg from foo: different message different message`)

		// write yamat.json file on root project containing foo, bar and third subprojects
		writeFile('project1/yamat.json', `
		[
			{"name": "foo", "path": "./foo"}, 
			{"name": "bar", "path": "./bar"},
			{"name": "third", "path": "./third"}
		]`)
	}

	if (performBeforeAll === true || performBeforeAll === 'beforeAll') {
		beforeAll(fn)
	}
	else if (performBeforeAll === 'beforeEach') {
		beforeEach(fn)
	}
	else {
		fn()
	}

}

export function exec0(cmd: string, expect0StatusCode: boolean = true): ExecOutputReturnValue {
	const p = exec(cmd)
	if (expect0StatusCode) {
		expect(p.code).toBe(0)
	}
	return p
}
