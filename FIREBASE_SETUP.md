# How to Get Firebase Credentials

To enable Google Sign-In and Cloud Sync, you need to link this app to a Firebase project.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"**.
3. Name your project (e.g., `breathing-app`) and click **Continue**.
4. Disable Google Analytics (optional, simpler for now) and click **Create project**.

## 2. Register Your App

1. Once your project is ready, you'll be on the Project Overview page.
2. Click the **Web** icon (`</>`) under "Get started by adding Firebase to your app".
3. Enter an **App nickname** (e.g., `Breathing Web`).
4. Click **Register app**.

## 3. Get Configuration Keys

1. You will see a code block labeled `const firebaseConfig = { ... };`.
2. Copy the values inside the cursly braces `coverage` and paste them into your `.env` file.

**Mapping:**

| Firebase Config | .env File Variable |
| :--- | :--- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

## 4. Enable Google Sign-In

1. Go to **Authentication** in the left sidebar.
2. Click **Get started**.
3. Select **Google** from the list of Sign-in providers.
4. Click **Enable**.
5. Select a **Project support email** and click **Save**.

## 5. Restart Development Server

After saving your `.env` file, stop the running server (`Ctrl+C` in terminal) and run:

```bash
npm run dev
```
