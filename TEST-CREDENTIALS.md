# Test Account Credentials

For development and testing purposes, a test account is automatically created when you run the seed script.

## Login Credentials

**Email**: `test@test.com`
**Password**: `test123`

## How to Use

1. Make sure you've run the seed script:
   ```bash
   npx tsx prisma/seed.ts
   ```

2. Navigate to http://localhost:3000/login

3. Login with the credentials above

4. You'll have full access to:
   - Browse stories at `/stories`
   - Save favorites
   - View your library at `/library`
   - Access dashboard at `/dashboard`

## Resetting the Test Account

If you need to reset the test account, simply run the seed script again:
```bash
npx tsx prisma/seed.ts
```

The script uses `upsert` so it won't create duplicates - it will just ensure the test account exists.

---

**Note**: This is for development only. Never use these credentials in production!
