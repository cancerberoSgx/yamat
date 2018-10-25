"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const src_1 = require("../src");
const util_1 = require("../src/util");
shelljs_1.config.silent = false;
// important! this tests need to be executed serially (jasmine random==false)
// TODO: 
// * beforeEach - not serially - do it right - i was with little time
// * separate CLI and API test
describe('poor man tests', () => {
    let p;
    beforeAll(() => {
        expect(shelljs_1.exec(`rm -rf project1 && mkdir project1 && cd project1 && npm init -y`).code).toBe(0);
        expect(shelljs_1.exec(`\\
cd project1 && mkdir foo && cd foo && npm init -y && \\
echo "module.exports = 'from foo'"> index.js `).code).toBe(0);
    });
    describe('API', () => {
        it('making sure npm install ../local will create links so we can start working as mono repo without extra tools', () => {
            p = shelljs_1.exec(`\\
cd project1 && mkdir bar && cd bar && npm init -y && npm install --save ../foo && \\
echo "console.log('foo say: '+require('foo'))"> index.js && node index.js`);
            expect(p.code).toBe(0);
            expect(p.stdout).toContain(`foo say: from foo`);
            expect(shelljs_1.exec(`cd project1/foo &&  echo "module.exports = 'different message'"> index.js`).code).toBe(0);
            p = shelljs_1.exec(`cd project1/bar && node index.js`);
            expect(p.code).toBe(0);
            expect(p.stdout).toContain(`foo say: different message`);
        });
        it('create other package that depends on var', () => {
            p = shelljs_1.exec(`\\
		cd project1/bar  && echo "module.exports.msg = 'msg from foo: '+require('foo')"> index.js && node index.js`);
            expect(p.code).toBe(0);
            // expect(p.stdout).toContain(`me: different message`)
            expect(shelljs_1.exec(`\\
cd project1 && mkdir third && cd third && npm init -y && \\
npm install --save ../foo ../bar && \\
echo "console.log('third responds: '+require('bar').msg + ' '+ require('foo'))" > index.js `).code).toBe(0);
            p = shelljs_1.exec(`\\
cd project1/third && node index.js`);
            expect(p.code).toBe(0);
            expect(p.stdout).toContain(`third responds: msg from foo: different message different message`);
        });
        it('unlink', () => {
            util_1.writeFile('project1/yamat.json', `
		[
				{"name": "foo", "path": "./foo"}, 
				{"name": "bar", "path": "./bar"},
				{"name": "third", "path": "./third"}
		]`);
            expect(JSON.parse(shelljs_1.cat('project1/bar/package.json')).dependencies.foo).toBe("file:../foo");
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.foo).toBe("file:../foo");
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.bar).toBe("file:../bar");
            src_1.unlink({ rootPath: 'project1' });
            expect(JSON.parse(shelljs_1.cat('project1/bar/package.json')).dependencies.foo).toBe("1.0.0");
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.foo).toBe("1.0.0");
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.bar).toBe("1.0.0");
            src_1.link({ rootPath: 'project1' });
            expect(JSON.parse(shelljs_1.cat('project1/bar/package.json')).dependencies.foo).toBe("file:../foo");
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.foo).toBe("file:../foo");
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.bar).toBe("file:../bar");
        });
        it('unlink --version pack', () => {
            src_1.unlink({ rootPath: 'project1', version: src_1.UnlinkVersion.pack });
            expect(JSON.parse(shelljs_1.cat('project1/bar/package.json')).dependencies.foo).toContain("project1/.yamat/foo-1.0.0.tgz");
            expect(shelljs_1.test('-f', JSON.parse(shelljs_1.cat('project1/bar/package.json')).dependencies.foo)).toBe(true);
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.foo).toContain("project1/.yamat/foo-1.0.0.tgz");
            expect(shelljs_1.test('-f', JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.foo)).toBe(true);
            expect(JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.bar).toContain("project1/.yamat/bar-1.0.0.tgz");
            expect(shelljs_1.test('-f', JSON.parse(shelljs_1.cat('project1/third/package.json')).dependencies.bar)).toBe(true);
        });
        xit('link', () => {
        });
        it('run', () => {
            src_1.run({ rootPath: 'project1', cmd: 'echo "hello" && exit 0', breakOnError: true });
            // TODO: expect here ? 
        });
        xit('run --breakOnError=true', () => {
        });
    });
    describe('CLI', () => {
        // following are CLI test - TODO: put this in other file - we dont have time now - taking advantage of exiting test projects
        it('yamat run', () => {
            const p = shelljs_1.exec(`\\
cd project1
npm i --save-dev ..
npx yamat run  'echo "hello123" && exit 0' 
		`);
            expect(p.code).toBe(0);
            expect(p.stdout).toContain('hello123');
            //TODO: test --breakOnError=true
        });
        it('yamat forceDependenciesLatest', () => {
            //TODO. --exclude --excludeDependencies
            const p = shelljs_1.exec(`\\
cd project1/foo && \\
npm i --save hrtime-now@1.0.0 && \\
cd .. && \\
npx yamat forceDependenciesLatest && \\
cd ..
		`);
            expect(p.code).toBe(0);
            const dependencies = JSON.parse(shelljs_1.cat('project1/foo/package.json')).dependencies;
            expect(dependencies['hrtime-now']).not.toBe('1.0.0');
        });
        xit('yamat forceDependenciesLatest --exclude --excludeDependencies', () => {
        });
        // TODO: CLI - test other commands
    });
});
//# sourceMappingURL=usecase1Spec.js.map