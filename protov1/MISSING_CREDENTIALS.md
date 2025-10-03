# 🚨 MISSING CREDENTIALS - ACTION REQUIRED

Your `.env` file has been created with most credentials, but you need to fill in these 4 missing values:

---

## ✅ What's Already Configured

- ✅ **JWT_SECRET**: `vs04sqfOpaVotjE7nrDLy7iSec/Y9x0gZDE2HuOdlgM=`
- ✅ **Supabase Project**: `ycfxudvobatbwgakplie`
- ✅ **B2 Account ID**: `005077f69ecb36c0000000001`
- ✅ **B2 Bucket ID**: `5007c7ef1609ae7c9b93061c`
- ✅ **SendGrid API Key**: `SG.2crW8gq9QzO1zlAtkWXPFw...`

---

## ⚠️ What You MUST Add (4 Items)

### 1. DATABASE_URL - Supabase Password
**Current value**:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ycfxudvobatbwgakplie.supabase.co:5432/postgres
```

**What to do**:
1. Go to https://supabase.com/dashboard/project/ycfxudvobatbwgakplie
2. Go to **Settings** → **Database** 
3. Scroll to **Connection String** → **URI**
4. Copy the full connection string (it will have your password)
5. Replace the entire `DATABASE_URL` line in `.env`

**Example**:
```bash
DATABASE_URL=postgresql://postgres:MySecurePass123@db.ycfxudvobatbwgakplie.supabase.co:5432/postgres
```

---

### 2. B2_APPLICATION_KEY - The Actual Secret Key
**Current value**: `oryxa-proto-key` (this is just the key NAME, not the secret)

**What to do**:

**Option A: If you saved the key when creating it**
- Find the secret key you saved (starts with `K005...`)
- It's a long alphanumeric string like: `K005abc123def456...`
- Add it to `.env`:
```bash
B2_APPLICATION_KEY=K005your_actual_secret_key_here
```

**Option B: If you didn't save it (most common)**
1. Go to https://secure.backblaze.com/app_keys.htm
2. **Delete** the old "oryxa-proto-key" (you can't retrieve the secret)
3. Click **Add a New Application Key**
   - Key Name: `oryxa-proto-key-new`
   - Allow access to: **All**
   - Capabilities: **All** (or at least: Read, Write, Delete, List)
4. Click **Create New Key**
5. **IMMEDIATELY COPY** the `applicationKey` (shown only once!)
6. Update `.env`:
```bash
B2_APPLICATION_KEY=K005your_new_secret_key_here
```

---

### 3. B2_BUCKET_NAME - The Bucket's Name
**Current value**: Empty (you only provided the bucket ID)

**What to do**:
1. Go to https://secure.backblaze.com/b2_buckets.htm
2. Find the bucket with ID: `5007c7ef1609ae7c9b93061c`
3. Copy the bucket name (left column, e.g., "oryxa-invoices" or similar)
4. Add it to `.env`:
```bash
B2_BUCKET_NAME=your-bucket-name-here
```

**Also update the legacy naming**:
```bash
B2_BUCKET=your-bucket-name-here
```

---

### 4. SENDGRID_FROM_EMAIL - Your Verified Sender Email
**Current value**: `noreply@yourdomain.com` (placeholder)

**What to do**:
1. Go to https://app.sendgrid.com/settings/sender_auth/senders
2. Look for your **verified sender** (green checkmark)
3. Copy that email address
4. Update `.env`:
```bash
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
SENDGRID_SENDER=your-verified-email@domain.com
```

**Example**:
```bash
SENDGRID_FROM_EMAIL=invoices@mycompany.com
SENDGRID_FROM_NAME=My Company Invoices
```

---

## 📝 Quick Edit Guide

Open `.env` in your editor and update these 4 sections:

```bash
# 1. Add your Supabase password
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.ycfxudvobatbwgakplie.supabase.co:5432/postgres

# 2. Add the actual B2 application key secret
B2_APPLICATION_KEY=K005your_actual_secret_key_here

# 3. Add your B2 bucket name
B2_BUCKET_NAME=your-bucket-name-here
B2_BUCKET=your-bucket-name-here

# 4. Add your verified SendGrid sender email
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
SENDGRID_SENDER=your-verified-email@domain.com
```

---

## ✅ Verification Commands

After updating `.env`, test each connection:

### Test 1: Database Connection
```bash
npx prisma db pull
```
✅ **Success**: "Introspected X models..."  
❌ **Fail**: "Authentication failed" → Check password in DATABASE_URL

---

### Test 2: SendGrid
```bash
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_SENDGRID_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{"to": [{"email": "your-email@domain.com"}]}],
    "from": {"email": "YOUR_SENDGRID_FROM_EMAIL"},
    "subject": "Test from Oryxa",
    "content": [{"type": "text/plain", "value": "Setup successful!"}]
  }'
```
✅ **Success**: Empty response or 202 status  
❌ **Fail**: Check SENDGRID_FROM_EMAIL is verified

---

### Test 3: Backblaze B2
```bash
# Test using AWS CLI (if installed)
aws s3 ls \
  --endpoint-url=https://s3.us-west-004.backblazeb2.com \
  --profile b2

# Or just try to upload when running the app
```

---

## 🚀 Once Complete, Run:

```bash
# Install dependencies
npm install

# Apply database migrations
npx prisma migrate dev --name init

# Seed sample data
node scripts/seed.js

# Start development server
npm run dev
```

Then test: http://localhost:3000/api/health

---

## 🆘 Still Stuck?

### "I can't find my Supabase password"
- Go to Supabase dashboard → Settings → Database
- Click **Reset database password**
- Copy the new password and update DATABASE_URL

### "I lost my B2 application key"
- You MUST create a new one (keys aren't retrievable)
- Go to App Keys → Delete old one → Create new one
- Save the new secret immediately

### "SendGrid says sender not verified"
- Go to Sender Authentication → Single Sender Verification
- Add new sender → Verify email → Use that email

---

**After filling these 4 values, you're ready to code!** 🎉
