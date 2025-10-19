# Flare, Ignite, Community

## Run ems:
STORAGE_EMULATOR_HOST=127.0.0.1:9199 \
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
firebase emulators:start --import=localTest --export-on-exit=localTest


## Run Tests Like Ci
* npx jest --ci --reporters=default --reporters=jest-junit           
ls -R reports/jest
* npx cypress run --browser chrome