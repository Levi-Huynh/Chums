# Chums
CHUrch Management Software

Visit <a href="https://streaminglive.church/">https://chums.org/</a> to learn more.

### Depends on
* [AccessManagementApi](https://github.com/LiveChurchSolutions/AccessManagement) - User authentication

### Components
* **ChumsApi** - NodeJS API for accessing app data (api.chums.org)
* **ChumsApp** - ReactJS control panel interface for tracking member data (app.chums.org)
* **ChumsWeb** - ReactJS brochure site that contains registration (chums.org)
* **CheckinAndroid** - Android app for self-checkin tablets at churches that prints name labels.
* **CypressTests** - Automated test scripts for ChumsApp

### Dev Setup Instructions
* **React Apps** - Copy dotenv.sample.txt file in either ChumsApp or ChumsWeb to .env and run npm start.  You can keep the default values that point to the staging APIs.  To create a test account visit https://staging.chums.org/
