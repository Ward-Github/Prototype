
# Setup Guide

Follow the steps below to set up your project environment for both client-side and server-side configurations.

## Prerequisites

- Node.js (preferably the LTS version)
- Bun
- Expo Go for mobile app

## Environment Configuration

### Finding Your IPv4 Address

To find your IPv4 address:

1. Open Command Prompt.
2. Type `ipconfig` and press Enter.
3. Locate and copy your IPv4 address.

### Server Side (.env file)

1. Create a `.env` file in the server folder.
2. Copy the following into the server `.env` file, replacing `{ip}` with your IPv4 address:

   ```plaintext
   HOST=smtp.gmail.com
   PORT=587
   USER=schubergcodemail@gmail.com
   PASS=kksc hfav tfxt hscn
   EXPO_PUBLIC_API_URL={ip}
   ```

### Client Side (.env file)

1. Create a `.env` file in the client folder.
2. Copy the following into the client `.env` file, replacing `{ip}` with your IPv4 address:

   ```plaintext
   EXPO_PUBLIC_API_URL={ip}
   ```

## Installation

### Client Side

1. Navigate to the client directory.
2. Run the following command to install dependencies:

   ```bash
   npm i
   ```

### Server Side

1. Navigate to the server directory.
2. Run the following commands to install dependencies:

   ```bash
   npm i
   pip install easyocr
   ```

## Starting the Project

1. Run the `start.bat` file to start the project.

## Login

Use the following credentials for login:

- **Email:** karsten@okta.com
- **Password for Okta:** 2vARM^E2rBH5u^KfWcvE
- **Password for login with email:** test12
