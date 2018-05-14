# yamat: yet another mono-repo administration tool

Tired of the complexities of lerna, rush or yarn workspaces ? 

This tool solves the problem of mono repos (multiple packages in the same repository) with a very straightforward solution. 

No links, no magic, not involved with the development cycle. All the rest is your responsibility, publish, versioning, no run on all, no tests, no parallel thing, no hacks

KISS. No magic. Slow. Don't try to save space on your disk. Don't solve any npm problem - npm standard. Just a simple transformation to your package.json

It's user responsibility to execute yamat link or unlink after install before publish. 

# Tutorial

let's create a new mono-repo with two packages inside, foo and bar, and bar depends on foo:

## Initial setup

```sh
mkdir project1 && cd project1 && npm init -y
mkdir foo && cd foo && npm init -y && echo "module.exports = 'from foo'"> index.js && cd ..
mkdir bar && cd bar && npm init -y && npm install --save ../foo && echo "console.log('foo say: '+require('foo'))"> index.js && cd ..
```

We setup both packages - bar points to ../foo. We haven't used yamat yet. 

Notice that we are ready to work since bar/node_modules/foo is a symbolic link that npm created Install other dependencies on each internal repository, as usual - on this regard they are independent. 

The problem arises when we start publishing. We want to publish both

## Setup yamat

```sh
npm install --save-dev yamat
cat > yamat.json 
[
  {"name": "foo", "path": "./foo"}, 
  {"name": "bar", "path": "./bar"}
]
^D 
```

## First publish

```sh
npx yamat unlink
cd foo && npm publish && cd ..
cd bar && npm publish && cd ..
```

## Keep developing and publish again

```sh
npx yamat link
# ready to local development. write test compile install, etc
# now we want to publish foo
cd foo && npm version patch && cd ..
npx yamat unlink
cd foo && npm publish && cd ..
npx yamat link
# and we are ready to work again!
```


# how it works

## link will:
 
 * for each dependency found in your internal package's package.json that points to an internal package it will change it to point to the local folder. Then executes `npm install` (that will create links to local packages out of the box )

## unlink will: 
 
 * for each dependency found in your internal package's package.json that points to an internal package it will execute npm install --save $localPackage@VERSION where @VERSION is the version local version of the package. 


# Things for the future:

* Alternative `yamat unlink --version npm` will use the latest version found in npmjs.org (so we can test with the actual real thing)
* yamat unlink --version=pack to point to npm pack generated file so we are sure the publish will go fine. 
* yamat run X for run X on every package
* yamat init ./package1, foo/package2   etc etc to create the yamat.json file from given pacakges.