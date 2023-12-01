# Radiology Archive's Backend

The backend of Radiology Archive, built on [Express.js](https://expressjs.com/) and utilizing various technologies like [Prisma](https://www.prisma.io/), [PlanetScale](https://planetscale.com/), [Firebase Auth & Storage](https://firebase.google.com/), and [Stripe](https://stripe.com/docs/development) — designed to manage and serve medical imaging data securely and handle user authentication and payment processing.

## Documentation

See the [radiology archive API docs](https://databasekeepers.github.io/backend/).

## Project Structure

```bash
.
├── docs                        # Documentation for API
├── prisma
│   └── schema.prisma
├── src
│   ├── config                  # External services: (planetscale & firebase)
│   │   ├── db.js
│   │   ├── firebase.js
│   │   └── stripe.js
│   ├── controllers             # Binds routes and validate requests to service
│   │   ├── auth.controller.js
│   │   ├── hospital.controller.js
│   │   ├── image.controller.js
│   │   ├── payment.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   ├── middlewares
│   │   ├── authorization.js                # Ensure user is permitted to access an endpoint
│   │   ├── check-existing-images.js        # Ensure user has images before proceeding to transaction process
│   │   ├── check-image-has-invoice.js      # Ensure user does not pay for an image more than once for the same radiologist
│   │   ├── check-image-note-permissions.js # Ensure user is authorized having a patient relation with the patient's image
│   │   ├── check-unpaid-invoices.js        # Prevent user from creating multiple invoices before paying previous ones
│   │   ├── create-stripe-user.js           # Creates stripe customer upon given user
│   │   ├── errors.js                       # Processes any errors from the route's schema
│   │   ├── firebase-auth.js                # Ensure valid firebase token in request header
│   │   └── validators.js                   # Contains schemas to be used in express.js routes
│   ├── routes                              # Contains all route definitions
│   │   ├── auth.route.js
│   │   ├── hospital.route.js
│   │   ├── image.route.js
│   │   ├── payment.route.js
│   │   ├── stripe.route.js
│   │   ├── user.route.js
│   │   └── index.js
│   ├── services                # Employs logic to requests from controller
│   │   ├── auth.controller.js
│   │   ├── hospital.controller.js
│   │   ├── image.controller.js
│   │   ├── payment.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   ├── utils                   # Snippets to be used throughout codebase
│   │   ├── environment.js      # Environment variables are loaded here and exported
│   │   └── errors.js           # Returns any errors before servicing
│   ├── app.js                  # Initialize express appication and its dependencies
│   └── index.js                # Entry point to start express appplication
├── README.md
├── package.json
├── package-lock.json
├── .prettierrc
└── .env.example

```

# Running the Project Locally

## Install

    $ git clone https://github.com/DatabaseKeepers/backend
    $ cd backend
    $ npm run install

## Configure app

Rename the .env.example to .env
🔴 are required! Put the values in single quotes!

- 🔴 DATABASE_URL
- 🔴 FIREBASE_ADMIN_CREDENTIALS
- 🔴 FIREBASE_API_KEY
- 🔴 FIREBASE_AUTH_DOMAIN
- 🔴 FIREBASE_PROJECT_ID
- 🔴 FIREBASE_STORAGE_BUCKET
- 🔴 FIREBASE_MESSAGING_SENDER_ID
- 🔴 FIREBASE_APP_ID

- 🔴 STRIPE_SECRET_KEY
- 🔴 STRIPE_WEBHOOK_SECRET_KEY

- ⭕ PORT

## Running the project

    $ npm run dev
