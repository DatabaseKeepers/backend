```bash
.
├── src
│   ├── config                  # External services: (planetscale & firebase)
│   │   ├── db.js
│   │   └── firebase.js
│   ├── controllers             # Binds routes and validate requests to service
│   │   ├── auth.controller.js
│   │   └── index.js
│   ├── middlewares
│   │   └── firebase-auth.js    # Ensure valid firebase token in request header
│   ├── routes                  # Contains all route definitions
│   │   ├── auth.route.js
│       └── index.js
│   └── services                # Employs logic to requests from controller
│       ├── auth.controller.js
│       └── index.js
├── README.md
├── package.json
├── package-lock.json
└── .env

```
