# NocoDB setup — Masterclass backend

Use this checklist so the Next.js app can store registrations and feedback in NocoDB only.

## 1. Create an API token

1. Open NocoDB → Account settings → Tokens
2. Create a token with create / read / update access to your base
3. Copy it into `.env.local` as `NOCODB_API_TOKEN`

## 2. Set base URL

- Cloud: `https://app.nocodb.com` (or your workspace host)
- Self-hosted: `http://localhost:8080` (or your domain)

Put it in `.env.local` as `NOCODB_BASE_URL` (no trailing slash).

## 3. Create table: `masterclass_registrations`

Columns (names must match exactly):

| Column | Type | Notes |
|---|---|---|
| Id | System / Number | Auto (NocoDB primary key) |
| full_name | Single line text | required |
| email | Email / Single line text | required |
| phone_number | Single line text | required |
| country_code | Single line text | default `IN` |
| city | Single line text | optional |
| user_role | Single line text | optional |
| payment_id | Single line text | optional |
| order_id | Single line text | optional |
| payment_signature | Single line text | optional |
| amount_paid | Number | default `111` |
| payment_status | Single line text | default `unpaid` |
| course_name | Single line text | default `AI Masterclass` |

Copy the table ID from:

`Base → Table → ... → REST APIs`  
or from the URL path `/api/v2/tables/{tableId}/...`

Set `NOCODB_REGISTRATIONS_TABLE_ID`.

## 4. Create table: `masterclass_feedback`

| Column | Type |
|---|---|
| Id | System / Number |
| heard_from | Long text |
| hoping_to_learn | Long text |
| current_role | Single line text |
| ai_experience_level | Single line text |
| biggest_challenge | Long text |

Set `NOCODB_FEEDBACK_TABLE_ID`.

## 5. Env checklist

```env
NOCODB_BASE_URL=...
NOCODB_API_TOKEN=...
NOCODB_REGISTRATIONS_TABLE_ID=...
NOCODB_FEEDBACK_TABLE_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

## 6. Restart the app

```bash
npm run dev
```

Flow:

1. Form submit → NocoDB insert (`payment_status=unpaid`)
2. Razorpay checkout
3. Verify signature → NocoDB update (`paid` + payment fields)
4. Feedback form → NocoDB insert into feedback table
