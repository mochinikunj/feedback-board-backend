# Feedback Board Backend

Hello 👋  
Thanks for checking out this repository! This project is the backend for the **Feedback Board** application. It’s built to be simple to set up and easy to run locally or on AWS.

---

## 📖 About the Application

This is a **serverless backend** for a feedback board.  
It is implemented using:

- **Node.js**
- **Express**
- **TypeScript**
- **Serverless Framework**
- **AWS Lambda**
- **DynamoDB**

---

## ✅ Prerequisites

Before you begin, make sure the following are installed or configured on your system:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) (v20 or later; includes npm)
- An [AWS account](https://aws.amazon.com/free/)
  - ⚠️ Free-tier accounts should not incur charges with this setup. Non–free-tier accounts may see some costs.
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) with credentials configured in `~/.aws/credentials`
- [Postman](https://www.postman.com/downloads/)

---

## 🚀 Setup Instructions

> **Note:** These steps assume you’ve already completed the prerequisites.

1. Clone the repository

   ```bash
   git clone https://github.com/mochinikunj/feedback-board-backend.git
   ```

2. Navigate into the repo

   ```bash
   cd feedback-board-backend
   ```

3. Install dependencies

   ```bash
   npm ci
   ```

4. Deploy infrastructure to AWS (default environment is dev)

   ```bash
   npm run deploy
   ```

   - This step deploys the infra to AWS.
   - You’ll find the Lambda API endpoint in the command output.
   - If you use this endpoint, it will hit the AWS Lambda directly

5. Run the backend locally (but connected to AWS DynamoDB)

   ```bash
   npm start
   ```

   - This runs the code locally.
   - You’ll get a localhost endpoint on port 4000.
   - The local code connects to the real DynamoDB in your AWS environment.

6. Import the Postman collection provided in this repo (feedback-board.postman_collection) into your Postman app.
   - Update the api_endpoint variable in the collection with the endpoints you received in steps 4 & 5.

7. ✅ Done!
