```bash
.
├── prisma
│   └── schema.prisma
├── src
│   ├── config                  # External services: (planetscale & firebase)
│   │   ├── db.js
│   │   ├── firebase.js
│   │   └── stripe.js
│   ├── controllers             # Binds routes and validate requests to service
│   │   ├── auth.controller.js
│   │   ├── payment.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   ├── middlewares
│   │   ├── authorization.js        # Ensure user is permitted to access an endpoint
│   │   ├── create-stripe-user.js   # Creates stripe customer upon given user
│   │   ├── firebase-auth.js        # Ensure valid firebase token in request header
│   │   └── validators.js           # Contains schemas to be used in express.js routes
│   ├── routes                      # Contains all route definitions
│   │   ├── auth.route.js
│   │   ├── payment.route.js
│   │   ├── stripe.route.js
│   │   ├── user.route.js
│   │   └── index.js
│   ├── services                # Employs logic to requests from controller
│   │   ├── auth.controller.js
│   │   ├── payment.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   └── utils                   # Snippets to be used throughout codebase
│       ├── environment.js      # Environment variables are loaded here and exported
│       └── errors.js           # Returns any errors before servicing
├── README.md
├── package.json
├── package-lock.json
├── .prettierrc
└── .env.example

```

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
