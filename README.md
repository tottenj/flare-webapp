# Flare, Ignite, Community
[![codecov](https://codecov.io/gh/tottenj/flare-webapp/graph/badge.svg?token=WLHNW4MHC7)](https://codecov.io/gh/tottenj/flare-webapp)

**Flare** is a web application for discovering and promoting queer community events.  
It enables verified organizations to post events while giving users a fast, accessible way to explore what’s happening near them.

> This repository is an **active production codebase** and reflects real-world architectural decisions, tradeoffs, and constraints.

---

## ✨ Key Features

- 🏳️‍🌈 Event discovery for queer communities
- 🏢 Organization onboarding with verification workflow
- 📅 Event creation with controlled public visibility
- 🔐 Role-based access (Users, Organizations, Admin)
- 🖼️ Secure profile & proof image uploads
- 🧪 Full test coverage (unit, integration, E2E)

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Auth & Backend:** Firebase (Auth, Cloud Functions, Storage)
- **Database:** PostgreSQL (Neon) + Prisma ORM + PostGIS
- **Testing:** Jest, Firebase Emulators, Cypress
- **CI/CD:** GitHub Actions, Chromatic
- **Styling:** Tailwind CSS

---

## 🔐 Security Notes

- No secrets are committed to this repository
- All credentials are provided via environment variables
- Internal APIs are protected via method guards and internal API keys
- Firebase Storage access is scoped by authenticated user paths

---

## 🧪 Testing

Flare is tested at multiple levels:

- **Unit tests:** Domain & service logic (Jest)
- **Integration tests:** Prisma + Postgres + Firebase emulators
- **E2E tests:** Cypress with seeded auth & storage
- **Visual tests:** Storybook + Chromatic

---

## 🚧 Project Status

Flare is actively under development.  
APIs, schemas, and internal abstractions may change as the product evolves.

This repository is public for **learning, transparency, and portfolio purposes** and is not intended to be a plug-and-play template.

---

## 📄 License

All rights reserved.  
This codebase may not be used for commercial purposes without permission.

---

## 🙌 Acknowledgements

Built with a focus on equity, visibility, and community access.



## Run ems (Test only API Key) :
INTERNAL_API_KEY_DEV=4d522cbb22ae4ad19fe69211623a3a6bf8e9c098a16593b0ca0e0c0359c6f2d0 \
STORAGE_EMULATOR_HOST=127.0.0.1:9199 \
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
firebase emulators:start --import=localTest --export-on-exit=localTest


## Run Tests Like Ci
* npx jest --ci --reporters=default --reporters=jest-junit           
ls -R reports/jest
* npx cypress run --browser chrome



"DATABASE_URL": "postgresql://test:tester@postgres:5432/flare_test?schema=public",
"DATABASE_URL": "postgresql://test:tester@localhost:5434/flare_test?schema=public",
