# muwebles

## Setting Up working space
1. Install Firebase CLI using standalone binary or through npm via 'npm install -g firebase-tools'
https://firebase.google.com/docs/cli#windows-npm

2. Run 'firebase login' and authenticate Google account of Firebase project owner

3. Create a new project and get the 'firebaseConfig' from the Firebase dashboard and update /scripts/firebase.js accordingly

4. Run 'firebase init' for first the first time, and enable Realtime Database, Firestore, Hosting (optional), and Hosting Github Action Deploys (optional).
- If Step 4 fails, try deleting .firebase.src

5. Select "Use an existing project" then the corresponding created project
- If Firestore Setup fails, enable Cloud Firestore and create a database first via Firebase dashboard, then rerun 'firebase init'.
- Do not overwrite public/index.html

### Other things to check
- Ensure that Firestore rules are open. It is set as 'write false' by default.
- Ensure that Build-> Authentication-> Native Providers -> Email/Password is enabled for account registration to work

### Creating an admin/managing products and orders
- To create an admin, register an account. In Firestore, manually add a new property "isAdmin" on the user document and set it to 'true'. This adds a new navigation item 'Admin Console' under that user.

### Hosting
- To host with Firebase, run 'firebase deploy'

 
