import {rm, exec, ExecOutputReturnValue, cat} from 'shelljs'
import { writeFile } from '../src/util';
import { unlink, link } from '../src';

// important this tests need to be executed serially (jasmine random==false)
describe('use case 1', () => {
	let p: ExecOutputReturnValue

	it('making sure npm install ../local will create links so we can start working as mono repo without extra tools', () => {
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
	})


	
	it('create other package that depends on var', ()=>{

		p=exec(`\\
		cd project1/bar  && echo "module.exports.msg = 'msg from foo: '+require('foo')"> index.js && node index.js`
		)
		expect(p.code).toBe(0)
		// expect(p.stdout).toContain(`me: different message`)
		expect(exec(`\\
cd project1 && mkdir third && cd third && npm init -y && \\
npm install --save ../foo ../bar && \\
echo "console.log('third responds: '+require('bar').msg + ' '+ require('foo'))" > index.js `
		).code).toBe(0)
		p = exec(`\\
cd project1/third && node index.js`) 
expect(p.code).toBe(0)
expect(p.stdout).toContain(`third responds: msg from foo: different message different message`)
	})


	it('yamat unlink', ()=>{
		writeFile('project1/yamat.json', `
		[
				{"name": "foo", "path": "./foo"}, 
				{"name": "bar", "path": "./bar"},
				{"name": "third", "path": "./third"}
		]`)
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toBe("file:../bar")
		unlink({rootPath: 'project1'})
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toBe("1.0.0")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toBe("1.0.0")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toBe("1.0.0")
		link({rootPath: 'project1'})
		expect(JSON.parse(cat('project1/bar/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.foo).toBe("file:../foo")
		expect(JSON.parse(cat('project1/third/package.json')).dependencies.bar).toBe("file:../bar")
// 		p=exec(`\\
// cd project1 && node ../bin/yamat unlink`
// 		)
// 		expect(p.code).toBe(0)

	})
})