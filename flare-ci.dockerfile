# Dockerfile.ci
FROM node:22.12.0

# Install Java and Firebase CLI
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk curl && \
    npm install -g firebase-tools

# Optional: Install Cypress dependencies
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev \
    libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
