# 🚀 QUICK START - Run This Now!

## Step 1: Start Server (Terminal 1)

Open a terminal and run:

```bash
cd /Users/shubham/Projects/protov1
npm run dev
```

**Leave this terminal running!** You should see:
```
✓ Ready in 1244ms
- Local: http://localhost:3000
```

---

## Step 2: Test APIs (Terminal 2)

**Open a SECOND terminal** (don't close the first!) and run:

```bash
# Test health endpoint
curl http://localhost:3000/api/health
```

Expected output:
```json
{"status":"ok","timestamp":"2025-10-03T...","service":"Oryxa API","version":"1.0.0"}
```

Then test invoices:
```bash
# List all invoices
curl http://localhost:3000/api/invoices

# Get specific invoice
curl http://localhost:3000/api/invoices/1
```

---

## 🎯 What's Happening

- **Terminal 1**: Running the server (keep it open!)
- **Terminal 2**: Testing the APIs

The 404 error for `GET /` is **normal** - there's no homepage, only API routes at `/api/*`

---

## ✅ Your Data

Already seeded in the database:

- **Admin User**: admin@oryxa.com (password: demo123)
- **Invoice 1**: INV-2025-0001 - $540.00 (Paid)
- **Invoice 2**: INV-2025-0002 - $1,180.00 (Sent)
- **Automation**: Overdue Invoice Reminder

---

## 🛠️ Useful Commands (Terminal 2)

```bash
# View database in browser
npx prisma studio
# Opens at http://localhost:5555

# Create a new invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": 1,
    "clientName": "New Client",
    "clientEmail": "client@example.com",
    "items": [
      {"description": "Service", "quantity": 2, "price": 100}
    ],
    "dueDate": "2025-11-15"
  }'
```

---

## 🔧 If Something Goes Wrong

### Server won't start (port 3000 in use)
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9
# Then start again
npm run dev
```

### Database connection error
```bash
# Start Docker containers
docker-compose up -d
# Then start server
npm run dev
```

### Clear cache and restart
```bash
rm -rf apps/api/.next
npm run dev
```

---

## 📊 What You Have Now

✅ **API Server**: Next.js on port 3000  
✅ **Background Worker**: Processing jobs  
✅ **Database**: PostgreSQL with sample data  
✅ **Redis**: Ready for queue  
✅ **Prisma Studio**: Database GUI on port 5555  

---

## 🎨 Next Steps

1. ✅ Test the APIs (see commands above)
2. 📊 Explore data with Prisma Studio
3. 🎯 Create your first invoice
4. 🏗️ Start building the frontend
5. 📚 Read `API_EXAMPLES.http` for more examples

---

**Ready to code!** 🚀

Keep Terminal 1 running with `npm run dev` and use Terminal 2 for all other commands!
