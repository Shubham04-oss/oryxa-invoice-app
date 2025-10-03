# 🔧 Database Connection Issue - TROUBLESHOOTING

## ⚠️ Current Problem

Cannot connect to Supabase database:
```
Error: P1001: Can't reach database server at `db.ycfxudvobatbwgakplie.supabase.co:5432`
```

The hostname `db.ycfxudvobatbwgakplie.supabase.co` cannot be resolved (DNS lookup fails).

---

## 🔍 Possible Causes

### 1. Project is Paused
Supabase pauses inactive projects on the free tier after 7 days of inactivity.

### 2. Incorrect Project URL
The project reference ID might be wrong.

### 3. Project Deleted
The project might have been deleted.

### 4. Wrong Region/Endpoint
Some Supabase projects use different endpoints.

---

## ✅ SOLUTION - Get Correct DATABASE_URL

### Step 1: Go to Your Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Log in with your account
3. Find your project (or create a new one if needed)

---

### Step 2: Get the Correct Connection String

#### Option A: From Database Settings (Recommended)
1. Click on your project
2. Go to **Settings** (gear icon) → **Database**
3. Scroll down to **Connection string**
4. Click **URI** tab
5. **COPY** the full connection string

**It will look like:**
```
postgresql://postgres.xxxxxxxxxxxxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**OR (direct connection):**
```
postgresql://postgres:PASSWORD@db.xxxxxxxxxxxxxx.supabase.co:5432/postgres
```

6. Replace `PASSWORD` with your actual database password: `Prototype%40oryxa_2025`

---

#### Option B: From Supabase Project Settings
1. In project dashboard, look for **Project URL** under Settings
2. The format is: `https://xxxxxxxxxxxxxx.supabase.co`
3. Your database URL will be: `db.xxxxxxxxxxxxxx.supabase.co`

**Example**:
- If Project URL is: `https://abcd1234efgh5678.supabase.co`
- Database URL is: `postgresql://postgres:Prototype%40oryxa_2025@db.abcd1234efgh5678.supabase.co:5432/postgres`

---

### Step 3: Check if Project is Paused

If you see a **"Project Paused"** message:
1. Click **"Restore Project"** or **"Unpause"**
2. Wait 2-3 minutes for project to start
3. Then get the connection string

---

### Step 4: Update .env File

Once you have the correct connection string, update `.env`:

```bash
# Replace the DATABASE_URL line with your correct connection string
DATABASE_URL=postgresql://postgres:Prototype%40oryxa_2025@db.CORRECT_PROJECT_ID.supabase.co:5432/postgres
```

**Important**: 
- Keep `Prototype%40oryxa_2025` as the password (the `%40` is the @ symbol URL-encoded)
- Replace only the project ID part
- Make sure there are no extra spaces

---

### Step 5: Test Connection

```bash
# Test if connection works
npx prisma db pull
```

**Success**: You'll see "Introspecting..." and schema information  
**Fail**: You'll see the same P1001 error → Check URL again

---

## 🆘 Alternative: Create New Supabase Project

If your project was deleted or you can't find it, create a new one:

### Step 1: Create New Project
1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Name: `Oryxa Prototype`
   - Database Password: `Prototype@oryxa_2025` (or choose new password)
   - Region: Choose closest to you (e.g., `us-east-1`)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

---

### Step 2: Get Connection String
1. Go to **Settings** → **Database**
2. Copy **Connection string** → **URI**
3. Replace `[YOUR-PASSWORD]` with `Prototype%40oryxa_2025`

---

### Step 3: Update .env
```bash
DATABASE_URL=postgresql://postgres:Prototype%40oryxa_2025@db.NEW_PROJECT_ID.supabase.co:5432/postgres
```

---

## 🔍 Common URL Formats

Supabase uses different formats depending on when project was created:

### Format 1: Direct Connection (Older)
```
postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres
```

### Format 2: Pooler (Newer - Recommended)
```
postgresql://postgres.PROJECT_ID:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

### Format 3: IPv6 Support
```
postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:6543/postgres?sslmode=require
```

**Try the format that Supabase dashboard shows you!**

---

## 📋 Checklist

Before continuing, verify:

- [ ] Logged into Supabase dashboard successfully
- [ ] Can see your project (not paused/deleted)
- [ ] Copied connection string from Settings → Database
- [ ] Password is URL-encoded: `Prototype%40oryxa_2025` (@ becomes %40)
- [ ] Updated DATABASE_URL in `.env` file
- [ ] No extra spaces or line breaks in DATABASE_URL
- [ ] Tested with: `npx prisma db pull`

---

## ✅ Once Connection Works

Run these commands in order:

```bash
# 1. Apply database schema (creates tables)
npx prisma migrate dev --name init

# 2. Seed sample data
node scripts/seed.js

# 3. Start development server
npm run dev
```

---

## 💡 Pro Tip: Use Supabase Connection Pooler

For better performance and connection management:

1. In Supabase dashboard → Settings → Database
2. Use **"Connection pooling"** string instead of direct
3. It looks like: `postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:5432/postgres`

This is more stable and recommended for production!

---

## 🆘 Still Having Issues?

### Test with psql (if installed)
```bash
psql "postgresql://postgres:Prototype%40oryxa_2025@db.ycfxudvobatbwgakplie.supabase.co:5432/postgres"
```

If this fails, the issue is definitely with the Supabase connection, not Prisma.

### Alternative Free Databases

If Supabase isn't working, try:

1. **Neon** - https://neon.tech (Serverless Postgres)
2. **Railway** - https://railway.app (Free $5 credit)
3. **ElephantSQL** - https://elephantsql.com (20MB free)
4. **Local Docker** - Run `docker-compose up -d` (included in project)

---

## 📞 Next Steps

**ACTION REQUIRED**: 

1. Go to https://supabase.com/dashboard
2. Find/create your project
3. Get the correct DATABASE_URL
4. Update `.env` file
5. Reply with the new DATABASE_URL (I can help update it)

OR

If you want to use **local database** instead:

```bash
# Start local PostgreSQL
docker-compose up -d

# Update .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/oryxa

# Continue with setup
npx prisma migrate dev --name init
```

---

**Last Updated**: October 3, 2025  
**Status**: ⚠️ Waiting for correct Supabase DATABASE_URL
