const TEST_DB = '/tmp/ditto-test.db'

process.env.DATABASE_URL = `file:${TEST_DB}`
process.env.JWT_SECRET = 'test-secret-key'
process.env.NODE_ENV = 'test'
process.env.CORS_ORIGIN = 'http://localhost:5173'

