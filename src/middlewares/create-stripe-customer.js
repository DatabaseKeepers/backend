import stripe from "../config/stripe.js";
import dbConn from "../config/db.js";

async function createStripeCustomer(req, res, next) {
  await dbConn
    .execute("SELECT stripe_id FROM StripeUser WHERE patient_uid = ?", [
      req.userUID,
    ])
    .then((result) => {
      if (result.size > 0) {
        req.stripeID = result.rows[0].stripe_id;
        next();
      } else {
        try {
          dbConn
            .execute("SELECT first_name, last_name FROM User WHERE uid = ?", [
              req.userUID,
            ])
            .then((result) => {
              const { firstName, lastName } = result.rows[0];
              req.patientName = firstName + " " + lastName;

              stripe.customers
                .create({
                  email: req.userEmail,
                  name: req.patientName,
                  metadata: {
                    patientUID: req.userUID,
                    radiologistUID: req.params.uid,
                  },
                })
                .then((customer) => {
                  if (customer.id) {
                    dbConn
                      .execute(
                        "INSERT IGNORE INTO StripeUser (patient_uid, stripe_id) VALUES (?, ?)",
                        [req.body.patient, customer.id]
                      )
                      .then((result) => {
                        if (result.rowsAffected > 0) {
                          req.stripeID = customer.id;
                          console.log("Stripe user created");
                          next();
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res
                          .status(500)
                          .json({ msg: "Error creating customer" });
                      });
                  } else {
                    res.status(500).json({ msg: "Error creating customer" });
                  }
                });
            });
        } catch (error) {
          console.log("createStripeCustomer: ", error);
        }
      }
    });
}

export default createStripeCustomer;
