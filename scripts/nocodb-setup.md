# NocoDB setup — Masterclass backend

Use this checklist so the Next.js app can store registrations, surveys, and optional pre-session feedback in NocoDB.

## 1. Create an API token

1. Open NocoDB → Account settings → Tokens
2. Create a token with create / read / update access to your base
3. Copy it into `.env.local` as `NOCODB_API_TOKEN`

## 2. Set base URL

Put your host in `.env.local` as `NOCODB_BASE_URL` (no trailing slash), e.g.:

`https://nocodb.neuralvarsity.ai`

## 3. Table: `masterclass_registrations` (done)

| Column | Type | Notes |
|---|---|---|
| Id | System / Number | Auto PK |
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

Set `NOCODB_REGISTRATIONS_TABLE_ID`.

## 4. Table: `masterclass_survey` (post-attendance)

Independent from registrations. Soft-linked via optional `email` / `registration_id` only.

Created via `node scripts/create-survey-table.mjs` (current table id: `m3tw06v9hkk5ugy`).

| Column | Type | Notes |
|---|---|---|
| Id | System / Number | Auto PK |
| CreatedAt / UpdatedAt | System timestamps | Auto |
| full_name | Single line text | optional |
| email | Email | soft link to registrant |
| registration_id | Single line text | optional soft ref to registration Id |
| phone_number | Single line text | optional |
| course_name | Single line text | which masterclass |
| overall_rating | Rating (1–5) | overall experience |
| content_rating | Rating (1–5) | content quality |
| instructor_rating | Rating (1–5) | instructor quality |
| recommendation_score | Number (0–10) | NPS-style |
| most_valuable | Long text | open feedback |
| what_to_improve | Long text | open feedback |
| would_attend_again | Single select | `Yes` / `No` / `Maybe` |
| topics_for_next | Long text | future topics |
| testimonial | Long text | optional quote |
| allow_testimonial_use | Checkbox | marketing consent |
| session_date | Date | masterclass date (`YYYY-MM-DD`) |

Set `NOCODB_SURVEY_TABLE_ID`.

API: `POST /api/survey`

## 5. Optional table: `masterclass_feedback` (pre-session)

Used by the landing-page optional form before the event (not post-attendance).

| Column | Type |
|---|---|
| Id | System / Number |
| heard_from | Long text |
| hoping_to_learn | Long text |
| current_role | Single line text |
| ai_experience_level | Single line text |
| biggest_challenge | Long text |

Set `NOCODB_FEEDBACK_TABLE_ID` only if you use that form.

## 6. Env checklist

```env
NOCODB_BASE_URL=...
NOCODB_API_TOKEN=...
NOCODB_REGISTRATIONS_TABLE_ID=...
NOCODB_SURVEY_TABLE_ID=...
NOCODB_FEEDBACK_TABLE_ID=...   # optional
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

## 7. Restart the app

```bash
npm run dev
```

Flows:

1. Register → NocoDB registrations + Razorpay
2. After the masterclass → `POST /api/survey` → NocoDB `masterclass_survey`
3. Optional pre-session feedback → `POST /api/feedback`
