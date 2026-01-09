# Muwebles: A Serverless E-commerce Platform

This project is a full-stack, serverless e-commerce website built as a commissioned proof-of-concept for a student's thesis. It provides a complete online shopping experience for a furniture store, from browsing products to completing payments, and includes a full administrative backend for site management.

## Key Features

*   **Customer Facing:**
    *   Dynamic product catalog and browsing
    *   User account creation and login
    *   Persistent shopping cart
    *   Secure checkout with PayPal integration
*   **Administrative Panel:**
    *   Role-based access for administrators
    *   Full CRUD (Create, Read, Update, Delete) functionality for products
    *   Customer order tracking and status management
    *   User account appeal and management system

## Technology Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript, jQuery
*   **Backend & Services:**
    *   **Google Firebase:** Used as the complete serverless backend.
    *   **Firebase Authentication:** For user registration and login (Email/Password).
    *   **Cloud Firestore:** NoSQL database for all application data (users, products, orders).
    *   **Firebase Storage:** For hosting all product imagery.
    *   **Firebase Hosting:** For deploying and serving the live application.
*   **Payment Integration:** PayPal API

---

## Getting Started (Developer Setup)

Follow these instructions to set up a local development environment.

### 1. Firebase CLI & Authentication
- Install the Firebase CLI, preferably using `npm install -g firebase-tools`.
  - [Official Firebase CLI documentation](https://firebase.google.com/docs/cli#windows-npm)
- Log in to your Google account using `firebase login`.

### 2. Project Initialization
- Create a new project in the [Firebase Console](https://console.firebase.google.com/).
- In your new project, get the `firebaseConfig` object and update the contents of `public/scripts/firebase.js` accordingly.
- Run `firebase init` in your local project directory.
- When prompted, select "Use an existing project" and choose the project you just created.
- Enable **Firestore**, **Storage**, and **Hosting**. Do **not** overwrite the existing `public/index.html` file.
- **Troubleshooting:** If the `init` command fails, try deleting the `.firebaserc` file and running it again.

### 3. Firebase Configuration
- **Firestore Rules:** Ensure your Firestore security rules allow reads and writes for development. The default rules are restrictive.
- **Authentication:** In the Firebase Console, go to **Build > Authentication > Sign-in method** and enable the **Email/Password** provider.

### 4. Creating an Admin User
- Register a new account through the application's register page.
- In the Firebase Console, go to **Build > Firestore Database**.
- Find the new user's document in your `users` collection.
- Manually add a new field named `isAdmin`, set its type to `Boolean`, and its value to `true`. This will grant access to the 'Admin Console' in the UI for that user.

### 5. Deployment
- To deploy the project to Firebase Hosting, run the command `firebase deploy`.