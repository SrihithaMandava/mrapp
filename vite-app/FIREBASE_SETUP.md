# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "slot-booking-app")
4. Follow the setup wizard

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Enable"

## Step 3: Get Firebase Config

1. In Firebase Console, click the gear icon > "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname
5. Copy the `firebaseConfig` object

## Step 4: Update Your Code

Open `vite-app/src/firebase.js` and replace the config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 5: Set Firestore Rules (Optional - for production)

In Firestore Database > Rules, update to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{booking} {
      // Allow anyone to read and create bookings
      allow read, create: if true;
      // Allow users to delete their own bookings
      allow delete: if request.auth != null;
      // Allow updates only to status field
      allow update: if request.resource.data.diff(resource.data).affectedKeys()
        .hasOnly(['status']);
    }
  }
}
```

## Step 6: Run Your App

```bash
npm run dev
```

## Features

### Customer View
- Book appointments by selecting date and time
- View their own bookings by email
- Cancel bookings

### Business Dashboard
- View all bookings in a table
- Filter by: All, Today, Upcoming
- Search by name or email
- Update booking status (Confirmed, Completed, Cancelled, No Show)
- Delete bookings
- View statistics (Total, Today, Upcoming, Confirmed)

## Database Structure

Collection: `bookings`

Document fields:
- `name` (string): Customer name
- `email` (string): Customer email
- `date` (string): Booking date (YYYY-MM-DD)
- `slot` (string): Time slot (e.g., "10:00 AM")
- `status` (string): confirmed | completed | cancelled | no-show
- `createdAt` (string): ISO timestamp

## Alternative: Use Local Storage (No Database)

If you don't want to set up Firebase, you can keep using the current local-only version in `App.jsx` (the `OldApp` component). Just change the main App component back to the original implementation.
