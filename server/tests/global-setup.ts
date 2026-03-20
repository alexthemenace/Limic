import { execSync } from 'child_process'
import { unlink } from 'fs/promises'

const TEST_DB = '/tmp/ditto-test.db'

export async function setup() {
  process.env.DATABASE_URL = `file:${TEST_DB}`
  process.env.JWT_SECRET = 'test-secret-key'

  try {
    await unlink(TEST_DB)
  } catch {
    // ignore if not exists
  }

  execSync('npx prisma migrate deploy', {
    cwd: new URL('..', import.meta.url).pathname,
    env: { ...process.env, DATABASE_URL: `file:${TEST_DB}` },
    stdio: 'pipe',
  })
}

export async function teardown() {
  try {
    await unlink(TEST_DB)
  } catch {
    // ignore
  }
}
