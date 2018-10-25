import { exec0 } from "./testUtil";

describe('testUtil', () => {

  describe('exec0 single commands should exit correctly', () => {

    it('exec0', () => {
      expect(exec0('error', false).code).not.toBe(0)
      expect(exec0('echo 1', false).code).toBe(0)
    })

    it('multiple commands in separate lines dont need to be escaped with \\', () => {
      expect(exec0(`
      echo 123
      echo 345
      `, false).stdout).toMatch(/123\s+345/im)
    })

    it('exec0 multiple commands need to be separated by && so the chain breaks when one fails', () => {
      expect(exec0(`
      ls &&
      error &&
      ls
      `, false).code).not.toBe(0)
    })

    it('exec0 multiple commands without && will always return last command exit code', () => {
      expect(exec0(`
      ls
      error
      ls
      `, false).code).toBe(0)

      expect(exec0(`
      echo 123
      echo 345
      error3
      `, false).code).not.toBe(0)
    })
  })
})
