import { checkSchema } from "express-validator";
import dbConn from "../config/db.js";
import { adminAuth } from "../config/firebase.js";

async function checkEmailExists(email) {
  await adminAuth
    .getUserByEmail(email)
    .then((user) => {
      if (user) return Promise.reject();
      return Promise.resolve();
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") return Promise.resolve();
      return Promise.reject();
    });
}

async function checkImageExists(uid) {
  await dbConn
    .execute(
      "SELECT CASE WHEN EXISTS (SELECT 1 FROM Image WHERE uid = ?) THEN 1 ELSE 0 END AS image_exists",
      [uid]
    )
    .then((result) => {
      if (result.rows[0].image_exists === "1") {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    })
    .catch((error) => {
      console.log("checkImageExists: ", error.code, error.message);
      return Promise.reject();
    });
}

async function checkPatientExists(uid, { req }) {
  await dbConn
    .execute("SELECT email, first_name, last_name FROM User WHERE uid = ?", [
      uid,
    ])
    .then((result) => {
      if (result.rows.length > 0) {
        req.patientEmail = result.rows[0].email;
        req.patientName =
          result.rows[0].first_name + " " + result.rows[0].last_name;
        return Promise.resolve(req);
      }
      return Promise.reject();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

// Disable if physician exists in hospital
async function checkPhysicianExistsInHospital(hospital, { req }) {
  /* if (req.body.role === "physician") {
    await dbConn
      .execute(
        "\
      SELECT \
        U.uid, U.first_name, U.last_name, U.dob, U.claimed_as_physician \
      FROM User AS U \
      JOIN \
        HospitalPhysician AS HP ON U.uid = HP.physician_uid \
      WHERE HP.hospital_uid = ? \
      AND \
        U.first_name = ? \
      AND \
        U.last_name = ? \
      AND \
        U.dob = ? \
      AND \
        U.claimed_as_physician = false",
        [hospital, req.body.first_name, req.body.last_name, req.body.dob]
      )
      .then((result) => {
        if (result.size > 0) {
          req.userUID = result.rows[0].uid;
          return Promise.resolve(req);
        } else {
          return Promise.reject();
        }
      })
      .catch((error) => console.log(error.code, error.message));
  } */
  return Promise.resolve();
}

async function checkInvoiceExists(uid, { req }) {
  await dbConn
    .execute(
      "SELECT uid, patient_uid, amount FROM Invoice WHERE uid = ? AND patient_uid = ?",
      [uid, req.userUID]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        req.amount = result.rows[0].amount;
        return Promise.resolve(req);
      }
      return Promise.reject();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

async function checkInvoicePaid(uid) {
  await dbConn
    .execute("SELECT paid FROM Invoice WHERE uid = ?", [uid])
    .then((result) => {
      if (result.rows.length > 0) {
        if (result.rows[0].paid) return Promise.reject(); // paid
        return Promise.resolve(); // not paid
      }
      return Promise.reject();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

// disable due to add patient feature implemented differently
/* export const addPatientSchema = checkSchema(
  {
    email: {
      emailExists: {
        bail: true,
        custom: checkEmailExists,
        errorMessage: "Email already exists",
      },
      isEmail: {
        trim: true,
        errorMessage: "Invalid email",
      },
    },
    dob: { isISO8601: { errorMessage: "Invalid date of birth" } },
    first_name: { notEmpty: { errorMessage: "First name is required" } },
    last_name: { notEmpty: { errorMessage: "Last name is required" } },
    title: { optional: true },
  },
  ["body"]
); */

export const loginSchema = checkSchema(
  {
    email: { isEmail: { trim: true, errorMessage: "Invalid email" } },
    password: { notEmpty: { errorMessage: "Password is required" } },
  },
  ["body"]
);

export const signupSchema = checkSchema(
  {
    email: {
      emailExists: {
        bail: true,
        custom: checkEmailExists,
        errorMessage: "This email is already in use",
      },
      isEmail: {
        trim: true,
        errorMessage: "Invalid email",
      },
    },
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters",
      },
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
    dob: { isISO8601: { errorMessage: "Invalid date of birth" } },
    first_name: { notEmpty: { errorMessage: "First name is required" } },
    last_name: { notEmpty: { errorMessage: "Last name is required" } },
    title: { optional: true },
    role: {
      default: "patient",
      toLowerCase: true,
      isAlpha: {
        errorMessage: "Invalid role",
      },
      isIn: {
        options: [["patient", "radiologist", "physician"]],
        errorMessage: "Invalid role",
      },
    },
    hospital: {
      optional: true,
      physicianExists: {
        bail: true,
        custom: checkPhysicianExistsInHospital,
        errorMessage:
          "Account already exists or physician not found in hospital",
      },
    },
  },
  ["body"]
);

export const invoiceSchema = checkSchema(
  {
    uid: {
      notEmpty: {
        bail: true,
        errorMessage: "Radiologist's uid is required",
      },
      checkUid: {
        bail: true,
        custom: (uid) => {
          if (uid === "Select a radiologist") return Promise.reject();
          else return Promise.resolve();
        },
        errorMessage: "Please select a radiologist",
      },
      isLength: {
        bail: true,
        options: { min: 28, max: 28 },
        errorMessage: "Invalid radiologist's uid",
      },
    },
  },
  ["params"]
);

export const invoicesSchema = checkSchema(
  {
    userId: {
      notEmpty: {
        bail: true,
        errorMessage: "User's uid is required",
      },
      isString: {
        bail: true,
        options: { min: 28, max: 28 },
        errorMessage: "Invalid user's uid",
      },
    },
  },
  ["params"]
);

export const paySchema = checkSchema(
  {
    invoice: {
      notEmpty: {
        bail: true,
        errorMessage: "Invoice uid is required",
      },
      existsAndBelongsToUser: {
        bail: true,
        custom: checkInvoiceExists,
        errorMessage: "Invoice does not exist",
      },
      isPaid: {
        bail: true,
        custom: checkInvoicePaid,
        errorMessage: "Invoice has already been paid",
      },
    },
  },
  ["body"]
);

export const readNotificationSchema = checkSchema(
  {
    read: {
      isArray: {
        bail: true,
        errorMessage: "read must be an array",
      },
    },
  },
  ["body"]
);

export const updateImageNoteSchema = checkSchema({
  image_uid: {
    imageExists: {
      bail: true,
      custom: checkImageExists,
      errorMessage: "Image does not exist",
    },
  },
});

export const uploadImageSchema = checkSchema({
  patient: {
    notEmpty: {
      bail: true,
      errorMessage: "Patient's uid is required",
    },
    patientExists: {
      bail: true,
      custom: checkPatientExists,
      errorMessage: "Patient does not exist",
    },
  },
  url: {
    notEmpty: {
      bail: true,
      errorMessage: "Image url is required",
    },
    isURL: {
      bail: true,
      options: {
        host_whitelist: ["firebasestorage.googleapis.com"],
      },
      errorMessage: "Invalid image url",
    },
  },
});

export const updateEmailSchema = checkSchema(
  {
    email: {
      emailExists: {
        bail: true,
        custom: checkEmailExists,
        errorMessage: "This email is already in use",
      },
      isEmail: {
        trim: true,
        errorMessage: "Invalid email",
      },
    },
  },
  ["body"]
);

export const updateProfileSchema = checkSchema({
  profile_image_url: {
    isString: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Invalid profile image url",
    },
    optional: {
      options: {
        values: "falsy",
      },
    },
  },
  bio: {
    default: "",
    optional: true,
  },
});

export const sendResetPasswordSchema = checkSchema(
  {
    email: {
      isEmail: {
        bail: true,
        errorMessage: "Invalid email",
      }
    }
  },
  ["body"]
);