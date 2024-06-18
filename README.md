
# Setup Guide

Follow the steps below to set up your project environment for both client-side and server-side configurations.

## Environment Configuration

### Server Side (.env file)

1. Create a `.env` file in the root directory of your server.
2. Copy the following into the server `.env` file:

   \`\`\`plaintext
   HOST=smtp.gmail.com
   PORT=587
   USER=schubergcodemail@gmail.com
   PASS=kksc hfav tfxt hscn
   EXPO_PUBLIC_API_URL=192.168.178.65
   \`\`\`

### Client Side (.env file)

1. Create a `.env` file in the root directory of your client.
2. Copy the following into the client `.env` file, replacing `{ip}` with your IPv4 address:

   \`\`\`plaintext
   EXPO_PUBLIC_API_URL={ip}
   \`\`\`

3. To find your IPv4 address:
   - Open Command Prompt.
   - Type \`ipconfig\` and press Enter.
   - Locate and copy your IPv4 address.

## Installation

### Client Side

1. Navigate to the client directory.
2. Run the following command to install dependencies:

   \`\`\`bash
   npm i
   \`\`\`

### Server Side

1. Navigate to the server directory.
2. Run the following commands to install dependencies:

   \`\`\`bash
   npm i
   pip install easyocr
   \`\`\`

## Starting the Project

1. Run the \`start.bat\` file to start the project.

## Login

Use the following credentials for login:

- **Email:** karsten@okta.com
- **Password for Okta:** 2vARM^E2rBH5u^KfWcvE
- **Password for login with email:** test12
