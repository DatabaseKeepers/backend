```bash
.
├── src
│   ├── config                  # External services: (planetscale & firebase)
│   │   ├── db.js
│   │   └── firebase.js
│   ├── controllers             # Binds routes and validate requests to service
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   ├── middlewares
│   │   └── firebase-auth.js    # Ensure valid firebase token in request header
│   ├── routes                  # Contains all route definitions
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   └── index.js
│   ├── services                # Employs logic to requests from controller
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   └── utils                   # Snippets to be used throughout codebase
│       └── environment.js      # Environment variables are loaded here and exported
├── README.md
├── package.json
├── package-lock.json
└── .env.example

```

## Install

    $ git clone https://github.com/DatabaseKeepers/backend
    $ cd backend
    $ npm run install

## Configure app

Rename the .env.example to .env
🔴 are required! Put the values in single quotes!
- 🔴 DATABASE_URL           (GET FROM DISCORD)
- 🔴 FIREBASE_CREDENTIALS   (GET FROM DISCORD)
- ⭕PORT

## Running the project

    $ npm run dev
