# Flare, Ignite, Community
[![codecov](https://codecov.io/gh/tottenj/flare-webapp/graph/badge.svg?token=WLHNW4MHC7)](https://codecov.io/gh/tottenj/flare-webapp)
## Run ems:
INTERNAL_API_KEY=4d522cbb22ae4ad19fe69211623a3a6bf8e9c098a16593b0ca0e0c0359c6f2d0 \
STORAGE_EMULATOR_HOST=127.0.0.1:9199 \
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
firebase emulators:start --import=localTest --export-on-exit=localTest


## Run Tests Like Ci
* npx jest --ci --reporters=default --reporters=jest-junit           
ls -R reports/jest
* npx cypress run --browser chrome



"DATABASE_URL": "postgresql://test:tester@postgres:5432/flare_test?schema=public",
"DATABASE_URL": "postgresql://test:tester@localhost:5434/flare_test?schema=public",
