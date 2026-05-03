# CHRAN USSD Service
**Center for Human Rights Accountability Network**

Multilingual USSD backend — English, Yoruba, Igbo, Hausa.
Built for Vercel serverless deployment.

---

## Features
- Language selection (EN / YO / IG / HA)
- Report a Human Rights Violation (6 categories)
- Submit a Complaint
- Check Case Status (5-digit case number)
- Request Legal Aid (name + location collected)
- Emergency Contacts

---

## Deploy to Vercel

### Via GitHub
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import repo
3. Deploy — vercel.json handles all config
4. Callback URL: `https://your-project.vercel.app/api/ussd`

---

## Africa's Talking Sandbox Setup

1. Go to account.africastalking.com/apps/sandbox
2. Click USSD → Create Channel
3. Enter any code e.g. `*384*001#`
4. Set Callback URL to: `https://chran-ussd.vercel.app/api/ussd`
5. Save → open AT Android app → dial the code

---

## Test Case Numbers
| Number | Status |
|--------|--------|
| 10001 | Under Review |
| 10002 | In Progress |
| 10003 | Resolved |
| 10004 | Pending Documentation |
| 10005 | Escalated |

---

## Flow
Dial Code
└── Select Language (EN/YO/IG/HA)
└── Main Menu
├── 1. Report Violation → Category → Ref No.
├── 2. Submit Complaint → Enter Text → ID
├── 3. Check Case Status → 5-digit No. → Status
├── 4. Request Legal Aid → Name → Location → Ref
└── 5. Emergency Contacts
---

Built by PR3NC2 for CHRAN pitch demo.
