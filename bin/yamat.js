#!/usr/bin/env node
(async function(){
  try {
    await require('../dist/src/cli').main()
  } catch (error) {
    console.log('SEBA' , error, error.stack);
    process.exit(1)
  }
})()
