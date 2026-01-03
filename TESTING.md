# Testing Guide

## Overview

This project uses **Vitest** for unit and integration testing to ensure code quality and prevent schema-related bugs.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Test Structure

```
tests/
├── setup.ts              # Test configuration
├── lib/
│   └── auth/
│       └── session.test.ts   # Session management tests
├── api/
│   └── auth.test.ts          # API authentication tests
└── prisma/
    └── schema.test.ts        # Database schema validation
```

## What These Tests Prevent

### 1. Prisma Schema Mismatch Errors

**The Problem:**
When you modify the Prisma schema (e.g., adding a new field like `isAdmin`), the Prisma Client must be regenerated. If you forget to run `prisma generate`, you'll get runtime errors like:

```
Invalid prisma.user.findUnique() invocation
... isAdmin field not found
```

**The Solution:**
- **Automatic Generation**: Added `postmigrate` script that automatically runs `prisma generate` after migrations
- **Schema Validation Tests**: Tests in `tests/prisma/schema.test.ts` validate that all expected fields exist
- **Session Tests**: Tests verify that `getCurrentUser()` correctly includes all fields including `isAdmin`

### 2. Authentication Field Coverage

Tests ensure that authentication functions return all necessary user fields:

```typescript
// This test fails if isAdmin is missing
it('should include isAdmin field in user data', async () => {
  const user = await getCurrentUser()
  expect(user).toHaveProperty('isAdmin')
})
```

### 3. Admin Access Control

Tests verify that admin and non-admin users are handled correctly:

```typescript
it('should differentiate between admin and regular users', () => {
  expect(adminUser.isAdmin).toBe(true)
  expect(regularUser.isAdmin).toBe(false)
})
```

## Migration Workflow

**IMPORTANT**: Always follow this workflow when modifying the database schema:

```bash
# 1. Edit prisma/schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name your_migration_name

# 3. Prisma Client is auto-generated (via postmigrate hook)
# 4. Run tests to verify
npm test

# 5. Restart dev server if running
# Kill old server and start new one
```

## Common Issues & Fixes

### Issue: "Field not found in Prisma Client"

**Cause**: Prisma Client not regenerated after schema change

**Fix**:
```bash
npx prisma generate
```

Then restart your dev server.

### Issue: Tests failing with "Cannot find module"

**Cause**: Dependencies not installed

**Fix**:
```bash
npm install
```

### Issue: "Database is out of sync"

**Cause**: Migration not applied

**Fix**:
```bash
npx prisma migrate dev
```

## Writing New Tests

### Testing a New API Endpoint

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('My New API', () => {
  it('should do something', async () => {
    // Arrange
    const mockData = { ... }

    // Act
    const result = await myFunction(mockData)

    // Assert
    expect(result).toBeDefined()
  })
})
```

### Testing Prisma Schema Changes

Add to `tests/prisma/schema.test.ts`:

```typescript
it('should have myNewField in User model', () => {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

  expect(schemaContent).toContain('myNewField')
})
```

## CI/CD Integration

When setting up CI/CD, add this to your pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Check Prisma schema
  run: npx prisma validate
```

## Coverage (Future Enhancement)

To add test coverage reporting:

```bash
npm install --save-dev @vitest/coverage-v8
```

Update `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

Run with coverage:

```bash
npm test -- --coverage
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test
   ```

2. **Test schema changes immediately**
   - After any Prisma schema modification
   - Verify with `npm test`

3. **Keep tests fast**
   - Mock external dependencies
   - Use in-memory databases for DB tests

4. **Test edge cases**
   - Null/undefined values
   - Empty arrays/objects
   - Error conditions

5. **Update tests with code changes**
   - When adding features, add tests
   - When fixing bugs, add regression tests

---

**Remember**: Tests are your safety net. They catch bugs before they reach production!
