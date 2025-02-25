import * as Yup from "yup";

const noSpaceMessage = "No spaces allowed.";
const maxWords = 20;
const tooManyWordsMessage = `First name can have a maximum of ${maxWords} words.`;
const maxLengthFirstMessage =
  "First name should be less than or equal to 20 characters.";
const maxLengthLastMessage =
  "Last name should be less than or equal to 20 characters.";
const maxLengthGroupMessage =
  "It should be less than or equal to 30 characters.";
const maxLengthFirstMessage1 =
  "It should be less than or equal to 50 characters.";

// const noInitialSpace = (value) => !value?.startsWith(" ");
const noInitialSpace = (value) => !value || value.trimStart() === value;
const emailField = {
  email: Yup.string()
    .required("Email address is required.")
    .trim()
    .email("Please enter valid email address.")
    .test("is-valid-email", "Please enter valid email address.", (value) => {
      // This will check if the email contains at least one dot after the '@'
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    }), // Check for a valid email structure
};

/**
 * Login Validation Schema
 */
const loginSchema = Yup.object({
  email: Yup.string().required("Email is required."),
  password: Yup.string().required("Password is required."),
});

const weakPasswordSchema1 = Yup.string()
  .min(6, "Password must be at least 6 characters long.")
  .notRequired();

const mediumPasswordSchema1 = Yup.string()
  .min(
    8,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number."
  )
  .matches(/[a-z]/, "Password must include at least 1 lowercase letter.")
  .matches(/[A-Z]/, "Password must include at least 1 uppercase letter.")
  .matches(/\d/, "Password must include at least 1 number.")
  .notRequired();

const highPasswordSchema1 = Yup.string()
  .min(
    8,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(/[a-z]/, "Password must include at least 1 lowercase letter.")
  .matches(/[A-Z]/, "Password must include at least 1 uppercase letter.")
  .matches(/\d/, "Password must include at least 1 number.")
  .test(
    "no-repeated-sequences",
    "Password must not contain repeated sequences (e.g., 'abcabc' or '123123').",
    (value) => {
      if (!value) return true; // Skip validation if the field is empty
      const regex = /(.+)\1/; // Matches repeated sequences
      return !regex.test(value);
    }
  )
  .notRequired();

const extremePasswordSchema1 = Yup.string()
  .min(
    8,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(/[a-z]/, "Password must include at least 1 lowercase letter.")
  .matches(/[A-Z]/, "Password must include at least 1 uppercase letter.")
  .matches(/\d/, "Password must include at least 1 number.")
  .matches(/[\W_]/, "Password must include at least 1 special character.")
  .test(
    "no-repeated-sequences",
    "Password must not contain repeated sequences (e.g., 'abcabc' or '123123').",
    (value) => {
      if (!value) return true; // Skip validation if the field is empty
      const regex = /(.+)\1/; // Matches repeated sequences
      return !regex.test(value);
    }
  )
  .notRequired();

const weakPasswordSchema = Yup.string()
  .min(6, "Password must be at least 6 characters long.")
  .required("Password is required.");

const mediumPasswordSchema = Yup.string()
  .min(
    8,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number."
  )
  .matches(
    /[a-z]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number."
  )
  .matches(
    /[A-Z]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number."
  )
  .matches(
    /\d/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, and 1 number."
  )
  .required("Password is required.");

const highPasswordSchema = Yup.string()
  .min(
    8,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /[a-z]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /[A-Z]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /\d/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .test(
    "no-repeated-sequences",
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and no repeated sequences (e.g., 'abcabc' or '123123').",
    (value) => {
      if (!value) return false;
      const regex = /(.+)\1/; // Matches repeated sequences
      return !regex.test(value);
    }
  )
  .required("Password is required.");

const extremePasswordSchema = Yup.string()
  .min(
    8,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /[a-z]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /[A-Z]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /\d/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .matches(
    /[\W_]/,
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123')."
  )
  .test(
    "no-repeated-sequences",
    "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no repeated sequences (e.g., 'abcabc' or '123123').",
    (value) => {
      if (!value) return false;
      const regex = /(.+)\1/; // Matches repeated sequences
      return !regex.test(value);
    }
  )
  .required("Password is required.");

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."), // Disallow spaces
});

const resetPassSchemaWeek = Yup.object().shape({
  password: weakPasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  cnfPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
});

const resetPassSchemaExtreme = Yup.object().shape({
  password: extremePasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  cnfPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
});

const resetPassSchemaMedium = Yup.object().shape({
  password: mediumPasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  cnfPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
});
const resetPassSchemaHigh = Yup.object().shape({
  password: highPasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  cnfPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
});

const changePasswordByAdminWeek = Yup.object({
  new_password: weakPasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ), // Minimum 6 characters

  cnfPassword: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});
const changePasswordByAdminMedium = Yup.object({
  new_password: mediumPasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ), // Minimum 6 characters

  cnfPassword: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});
const changePasswordByAdminHigh = Yup.object({
  new_password: highPasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ), // Minimum 6 characters

  cnfPassword: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});

const changePasswordByAdminExtreme = Yup.object({
  new_password: extremePasswordSchema,
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ), // Minimum 6 characters

  cnfPassword: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});

const kycByAdmin = Yup.object({
  reject_reason: Yup.string().required("Reason is required."),
});

const changePasswordByClientWeek = Yup.object({
  old_password: weakPasswordSchema.required("Old Password is required."),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  new_password: weakPasswordSchema.required("New Password is required."), // Field is required

  cnfPassword: Yup.string()
    .required("Confirm password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});

const changePasswordByClientMedium = Yup.object({
  old_password: mediumPasswordSchema.required("Old Password is required."),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  new_password: mediumPasswordSchema.required("New Password is required."), // Field is required

  cnfPassword: Yup.string()
    .required("Confirm password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});

const changePasswordByClientHight = Yup.object({
  old_password: highPasswordSchema.required("Old Password is required."),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  new_password: highPasswordSchema.required("New Password is required."), // Field is required

  cnfPassword: Yup.string()
    .required("Confirm password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});
const changePasswordByClientExtreme = Yup.object({
  old_password: extremePasswordSchema.required("Old Password is required."),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Must Contain 8 Characters, Uppercase, Lowercase, Number and Special Character."
  // ),
  new_password: extremePasswordSchema.required("New Password is required."), // Field is required

  cnfPassword: Yup.string()
    .required("Confirm password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New password and Confirm Password doesn't match."
    ),
});

const addClientSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),

  ...emailField,
  company_name: Yup.string()
    .required("Compnay name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^\S.*\S$|^\S$/, "No spaces allowed.")
    .matches(/^\S.*\S$|^\S$/, noSpaceMessage),
});
const editClientSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),
  // Disallow spacesadmin panel
  ...emailField,
  phone_number: Yup.string()
    .min(7, "Please enter a phone number, 7 to 15 digits long.")
    .max(15, "Please enter a phone number, 7 to 15 digits long.")
    .matches(/^\d{7,15}$/, {
      message: "Please enter a phone number, 7 to 15 digits long.",
      excludeEmptyString: true,
    }),

  company_name: Yup.string()
    .required("Compnay name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^\S.*\S$|^\S$/, "No spaces allowed.")
    .matches(/^\S.*\S$|^\S$/, noSpaceMessage),
  address: Yup.string()
    .required("Address is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),

  state: Yup.string()
    .required("State is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  country: Yup.string().required("Country is required."),
  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema.required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .max(5, "Zipcode must be 5 digits long.")
    // .matches(/^\d{5}$/, {
    //   message: "Zipcode must be 5 digits long.",
    //   excludeEmptyString: true,
    // }),
    otherwise: (Schema) =>
      Schema.required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .matches(/^\d{6}$/, {
    //   message: "Zipcode must be 6 digits long.",
    //   excludeEmptyString: true,
    // }),

    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
});

const editClientHideSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),
  // Disallow spacesadmin panel
  email: Yup.string(),
  phone_number: Yup.string(),

  company_name: Yup.string()
    .required("Compnay name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^\S.*\S$|^\S$/, "No spaces allowed.")
    .matches(/^\S.*\S$|^\S$/, noSpaceMessage),
  address: Yup.string()
    .required("Address is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),

  state: Yup.string()
    .required("State is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  country: Yup.string().required("Country is required."),
  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema.required("Zipcode is required")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .max(5, "Zipcode must be 5 digits long.")
    // .matches(/^\d{5}$/, {
    //   message: "Zipcode must be 5 digits long.",
    //   excludeEmptyString: true,
    // }),
    otherwise: (Schema) =>
      Schema.required("Zipcode is required.")
        // .max(6, "Zipcode must be 6 digits long.")
        // .matches(/^\d{6}$/, {
        //   message: "Zipcode must be 6 digits long.",
        //   excludeEmptyString: true,
        // }),
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),

    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
});

const editMyProfileSchema = (role_id) =>
  Yup.object({
    first_name: Yup.string()
      .required("First name is required.")
      .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace)
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
      .max(20, maxLengthFirstMessage),

    last_name: Yup.string()
      .required("Last name is required.")
      .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace)
      .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
      .max(20, maxLengthLastMessage),
    // Disallow spacesadmin panel
    ...emailField,
    phone_number: Yup.string()
      .min(7, "Please enter a phone number, 7 to 15 digits long.")
      .max(15, "Please enter a phone number, 7 to 15 digits long.")
      .matches(/^\d{7,15}$/, {
        message: "Please enter a phone number, 7 to 15 digits long.",
        excludeEmptyString: true,
      }),
    address: Yup.string().when([], {
      is: () => role_id == 1 || role_id == 5 || role_id == 4,
      then: (Schema) =>
        Schema.notRequired()
          .test("no-initial-space", noSpaceMessage, noInitialSpace)
          .matches(/^[^\s].*$/, "Address should not start with a space."),
      otherwise: (Schema) =>
        Schema.required("Address is required.")
          .test("no-initial-space", noSpaceMessage, noInitialSpace)
          .matches(/^[^\s].*$/, "Address should not start with a space."),
    }),

    address2: Yup.string()
      .test("no-initial-space", noSpaceMessage, noInitialSpace)
      .matches(/^[^\s].*$/, "Address should not start with a space."),

    city: Yup.string().when([], {
      is: () => role_id == 1 || role_id == 5 || role_id == 4,
      then: (Schema) =>
        Schema.trim()
          .notRequired()
          .test("no-initial-space", noSpaceMessage, noInitialSpace)
          .matches(/^[^\s].*$/, "City should not start with a space.")
          .max(50, maxLengthFirstMessage1),
      otherwise: (Schema) =>
        Schema.required("City is required")
          .test("no-initial-space", noSpaceMessage, noInitialSpace)
          .matches(/^[^\s].*$/, "City should not start with a space.")
          .max(50, maxLengthFirstMessage1),
    }),
    state: Yup.string().when([], {
      is: () => role_id == 1 || role_id == 5 || role_id == 4,
      then: (Schema) =>
        Schema.notRequired().test(
          "no-initial-space",
          noSpaceMessage,
          noInitialSpace
        ),
      otherwise: (Schema) =>
        Schema.required("State is required.").test(
          "no-initial-space",
          noSpaceMessage,
          noInitialSpace
        ),
    }),

    country: Yup.string().when([], {
      is: () => role_id == 1 || role_id == 5 || role_id == 4,
      then: (Schema) => Schema.notRequired(),
      otherwise: (Schema) => Schema.required("Country is required."),
    }),
    // zipcode: Yup.string().when("country", {
    //   is: (value) => {
    //     return (
    //       (value == "United States" && (role_id == 1 || role_id == 5)) ||
    //       role_id == 1 ||
    //       role_id == 5
    //     );
    //   },
    //   then: (Schema) =>
    //     Schema.notRequired()
    //       .min(3, "Zipcode must be at least 3 characters long.")
    //       .max(16, "Zipcode must be no more than 16 characters long."),

    //   otherwise: (Schema) =>
    //     Schema
    //       // .required("Zipcode is required.")
    //       .min(3, "Zipcode must be at least 3 characters long.")
    //       .max(16, "Zipcode must be no more than 16 characters long."),
    // }),
    zipcode: Yup.string().when("country", {
      is: (value) =>
        (value === "United States" && (role_id === 2 || role_id === 3)) ||
        role_id === 2 ||
        role_id === 3,
      then: (Schema) =>
        Schema.required("Zipcode is required.")
          .min(3, "Zipcode must be at least 3 characters long.")
          .max(16, "Zipcode must be no more than 16 characters long."),
      otherwise: (Schema) =>
        Schema.notRequired()
          .min(3, "Zipcode must be at least 3 characters long.")
          .max(16, "Zipcode must be no more than 16 characters long."),
    }),
  });

const editMyProfileHideSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),
  // Disallow spacesadmin panel
  email: Yup.string(),
  phone_number: Yup.string()
    .min(7, "Please enter a phone number, 7 to 15 digits long.")
    .max(15, "Please enter a phone number, 7 to 15 digits long."),

  address: Yup.string()
    .required("Address is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    .trim()
    .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),
  state: Yup.string()
    .required("State is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  country: Yup.string().required("Country is required."),
  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema
        // .required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    otherwise: (Schema) =>
      Schema
        // .required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
});

const editAgentHideSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),
  email: Yup.string(),
  phone_number: Yup.string(),

  address: Yup.string()
    .required("Address is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),
  state: Yup.string()
    .required("State is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "State should not start with a space."),
  country: Yup.string().required("Country is required."),

  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema.required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .max(5, "Zipcode must be 5 digits long.")
    // .matches(/^\d{5}$/, {
    //   message: "Zipcode must be 5 digits long.",
    //   excludeEmptyString: true,
    // }),

    otherwise: (Schema) =>
      Schema.required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .min(3, "Zipcode must be at least 3 characters long.")
    // .max(16, "Zipcode must be 16 characters long.")
    // .matches(/^\d{6}$/, {
    //   message: "Zipcode must be 16 characters long.",
    //   excludeEmptyString: true,
    // }),

    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
});

const editAgentSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),

  ...emailField,
  phone_number: Yup.string()
    .min(7, "Please enter a phone number, 7 to 15 digits long.")
    .max(15, "Please enter a phone number, 7 to 15 digits long.")
    .matches(/^\d{7,15}$/, {
      message: "Please enter a phone number, 7 to 15 digits long.",
      excludeEmptyString: true,
    }),

  address: Yup.string()
    .required("Address is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),

  state: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "State should not start with a space.")
    .required("State is required."),

  country: Yup.string().required("Country is required."),

  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema.required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .max(5, "Zipcode must be 5 digits long.")
    // .matches(/^\d{5}$/, {
    //   message: "Zipcode must be 5 digits long.",
    //   excludeEmptyString: true,
    // }),
    otherwise: (Schema) =>
      Schema.required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .matches(/^\d{6}$/, {
    //   message: "Zipcode must be 6 digits long.",
    //   excludeEmptyString: true,
    // }),

    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
});

const AddNewTicketSchema = Yup.object({
  department: Yup.string()
    .required("Department is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
  subject: Yup.string()
    .required("Subject is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
  message: Yup.string()
    .required("Message is required")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
});

// const AgentGroupSchema = Yup.object({
//   group_name: Yup.string()
//     .required("Group name is required")
//     .matches(/^\S+$/, noSpaceMessage),
// });
const noInitialSpaceMessage = "Group name cannot start with a space.";
const AgentGroupSchema = Yup.object({
  group_name: Yup.string()
    .trim()
    .required("Group name is required.")
    .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "No spaces allowed.")
    .max(30, "Group name should be less than or equal to 30 characters."),
});
const AddAgentGroupSchema = Yup.object({
  group_names: Yup.string()
    .required("Group name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .max(30, "Group name should be less than or equal to 30 characters."),
});
const accManagerSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),
  // Disallow spaces
  ...emailField,
  phone_number: Yup.string()
    .min(7, "Please enter a phone number, 7 to 15 digits long.")
    .max(15, "Please enter a phone number, 7 to 15 digits long.")
    .matches(/^\d{7,15}$/, {
      message: "Please enter a phone number, 7 to 15 digits long.",
      excludeEmptyString: true,
    }),
  address: Yup.string()
    // .required("Address is required.")
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    // .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),

  country: Yup.string(),
  // .required("Country is required."),
  role_permission_id: Yup.string().required("Role is required."),
  state: Yup.string()
    // .required("State is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "State should not start with a space."),
  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema
        // .required("Zipcode is required.")
        // .max(5, "Zipcode must be 5 digits long.")
        // .matches(/^\d{5}$/, {
        //   message: "Zipcode must be 5 digits long.",
        //   excludeEmptyString: true,
        // }),
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    otherwise: (Schema) =>
      Schema
        // .required("Zipcode is required.")
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    // .matches(/^\d{6}$/, {
    //   message: "Zipcode must be 6 digits long.",
    //   excludeEmptyString: true,
    // }),

    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
  // .max(30, "Address should be less than or equal to 30 characters"),
});
const accManagerHideSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthFirstMessage),

  last_name: Yup.string()
    .required("Last name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .matches(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed.")
    .max(20, maxLengthLastMessage),
  // Disallow spaces
  email: Yup.string(),
  phone_number: Yup.string(),

  address: Yup.string()
    // .required("Address is required.")
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  address2: Yup.string()
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "Address should not start with a space."),

  city: Yup.string()
    // .required("City is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "City should not start with a space.")
    .max(50, maxLengthFirstMessage1),

  country: Yup.string(),
  // .required("Country is required."),
  role_permission_id: Yup.string().required("Role is required."),
  state: Yup.string()
    // .required("State is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .matches(/^[^\s].*$/, "State should not start with a space."),
  zipcode: Yup.string().when("country", {
    is: (value) => {
      return value == "United States";
    },
    then: (Schema) =>
      Schema
        // .required("Zipcode is required.")
        // .max(5, "Zipcode must be 5 digits long.")
        // .matches(/^\d{5}$/, {
        //   message: "Zipcode must be 5 digits long.",
        //   excludeEmptyString: true,
        // }),
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),
    otherwise: (Schema) =>
      Schema
        // .required("Zipcode is required.")
        // .max(6, "Zipcode must be 6 digits long.")
        // .matches(/^\d{6}$/, {
        //   message: "Zipcode must be 6 digits long.",
        //   excludeEmptyString: true,
        // }),
        .min(3, "Zipcode must be at least 3 characters long.")
        .max(16, "Zipcode must be no more than 16 characters long."),

    // .max(30, "Address should be less than or equal to 30 characters"),
  }),
  // .max(30, "Address should be less than or equal to 30 characters"),
});

const PasswordValidation = Yup.object({
  name: Yup.string()
    .required("Site name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .trim(),
  email: Yup.string()
    .required("User name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .trim(),
  password: Yup.string()
    .required("Password is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .trim(),
});

const AddRoleSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .trim(),
  description: Yup.string()
    .required("Description is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace)
    .trim(),
});

const ChangePasswordValidationWeek = Yup.object({
  old_password: Yup.string().required("Old Password required."),

  new_password: weakPasswordSchema.required("New Password  is required."), // Field is required

  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New Password and Confirm Password doesn't match."
    ),
});

const ChangePasswordValidationMedium = Yup.object({
  old_password: Yup.string().required("Old Password required."),
  new_password: mediumPasswordSchema.required("New Password  is required."), // Field is required

  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New Password and Confirm Password doesn't match."
    ),
});
const ChangePasswordValidationHigh = Yup.object({
  old_password: Yup.string().required("Old Password required."),

  new_password: highPasswordSchema.required("New Password  is required."), // Field is required

  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New Password and Confirm Password doesn't match."
    ),
});

const ChangePasswordValidationExtreme = Yup.object({
  old_password: Yup.string().required("Old Password required."),

  new_password: extremePasswordSchema.required("New Password  is required."), // Field is required

  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("new_password"), null],
      "New Password and Confirm Password doesn't match."
    ),
});

const FileValidation = Yup.object({
  name: Yup.string()
    .required("File name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
});

const AddUserValidationWeek = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: weakPasswordSchema,
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),
  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
  role_permission_id: Yup.string().required("Role is required."),
});

const AddUserValidationMedium = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: mediumPasswordSchema,
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),
  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
  role_permission_id: Yup.string().required("Role is required."),
});

const AddUserValidationHigh = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: highPasswordSchema,
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),
  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
  role_permission_id: Yup.string().required("Role is required."),
});

const AddUserValidationExtreme = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: extremePasswordSchema,
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),
  confirm_password: Yup.string()
    .required("Confirm Password is required.") // Field is required
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match."
    ),
  role_permission_id: Yup.string().required("Role is required."),
});

const EditUserValidation = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: weakPasswordSchema1.notRequired(),
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),

  confirm_password: Yup.string().when("password", {
    is: (password) => password && password.length > 0, // Check if password is defined and not empty
    then: (schema) =>
      schema
        .required("Confirm Password is required.")
        .oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password don't match."
        ),
    otherwise: (schema) => schema.notRequired(), // Make it not required if password is empty
  }),
  role_permission_id: Yup.string().required("Role is required."),
});

const EditUserValidationMedium = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: mediumPasswordSchema1.notRequired(),
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),

  confirm_password: Yup.string().when("password", {
    is: (password) => password && password.length > 0, // Check if password is defined and not empty
    then: (schema) =>
      schema
        .required("Confirm Password is required.")
        .oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password don't match."
        ),
    otherwise: (schema) => schema.notRequired(), // Make it not required if password is empty
  }),
  role_permission_id: Yup.string().required("Role is required."),
});
const EditUserValidationHigh = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: highPasswordSchema1.notRequired(),
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),

  confirm_password: Yup.string().when("password", {
    is: (password) => password && password.length > 0, // Check if password is defined and not empty
    then: (schema) =>
      schema
        .required("Confirm Password is required.")
        .oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password don't match."
        ),
    otherwise: (schema) => schema.notRequired(), // Make it not required if password is empty
  }),
  role_permission_id: Yup.string().required("Role is required."),
});

const EditUserValidationExtreme = Yup.object({
  name: Yup.string()
    .required("First name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  Lastname: Yup.string()
    .required("Last name is required.")
    .test("no-initial-space", noSpaceMessage, noInitialSpace),
  password: extremePasswordSchema1.notRequired(),
  email: Yup.string()
    .required("Email is required.")
    .matches(/^\S+$/, noSpaceMessage)
    .email("Please enter valid email address."),

  confirm_password: Yup.string().when("password", {
    is: (password) => password && password.length > 0, // Check if password is defined and not empty
    then: (schema) =>
      schema
        .required("Confirm Password is required.")
        .oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password don't match."
        ),
    otherwise: (schema) => schema.notRequired(), // Make it not required if password is empty
  }),
  role_permission_id: Yup.string().required("Role is required."),
});
const AddCardValidation = Yup.object({
  card_name: Yup.string()
    .required("Name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
  save_card: Yup.string(),
  Global_save: Yup.string(),
});

const AddBankValidation = Yup.object({
  card_name: Yup.string()
    .required("Account Holder Name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
  save_card: Yup.string(),
  Global_save: Yup.string(),
  account_number: Yup.string()

    .matches(/^\d{1,17}$/, "Only numbers are allowed.")
    .required("Account Number is required."),
  routing_number: Yup.string()
    .max(9, "Routing Number must be of 9 digits long.")
    .matches(/^\d+$/, "Only numbers are allowed.")
    .required("Routing Number is required."),
});

const EditBankValidation = Yup.object({
  card_name: Yup.string()
    .required("Name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
  save_card: Yup.string(),
});

const KeyWordSchema = Yup.object({
  key_name: Yup.string()
    .required("Keyword is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace),
});

const AddFilterSchema = Yup.object({
  group_names: Yup.string()
    .required("Name is required.")
    .trim()
    .test("no-initial-space", "No initial space allowed.", noInitialSpace)
    .max(30, "Filter name should be less than or equal to 30 characters."),
});
const AddSlackSchema = Yup.object({
  project_names: Yup.string().required("Project is required."),
});

const validateDescendingOrder = (value) => {
  // Ensure value is not empty
  if (!value) return true;

  // Split the value by commas and convert to numbers
  const numbers = value.split(",").map((num) => parseInt(num, 10));

  // Check for descending order
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i - 1] <= numbers[i]) {
      return false; // Fail validation if numbers are not in descending order
    }
  }
  return true; // Pass validation if all numbers are in descending order
};
const AddSettingSubscription = Yup.object({
  // overdue_period_days: Yup.string(),
  // suspend_period_days: Yup.string(),
  overdue_period_days: Yup.string()
    .matches(/^\d+$/, "Only whole numbers are allowed.")
    .matches(
      /^\d{1,2}$/,
      "Please enter a valid number of days (between 0 and 99)."
    )
    .test(
      "overdue-required",
      "Overdue period days is required when suspend period days has a value.",
      function (value) {
        const { suspend_period_days } = this.parent;
        return !suspend_period_days || !!value; // Require if suspend_period_days has a value
      }
    ),
  suspend_period_days: Yup.string()
    .matches(/^\d+$/, "Only whole numbers are allowed.")
    .matches(
      /^\d{1,2}$/,
      "Please enter a valid number of days (between 0 and 99)."
    )
    .test(
      "suspend-required",
      "Suspend period days is required when overdue period days has a value.",
      function (value) {
        const { overdue_period_days } = this.parent;
        return !overdue_period_days || !!value; // Require if overdue_period_days has a value
      }
    )
    .test(
      "greater-than-overdue",
      "Suspend period days must be greater than overdue period days.",
      function (value) {
        const { overdue_period_days } = this.parent;
        if (overdue_period_days && value) {
          if (overdue_period_days == "0" && value == "0") {
            return parseInt(value, 10) >= parseInt(overdue_period_days, 10);
          } else {
            return parseInt(value, 10) > parseInt(overdue_period_days, 10);
          }
        }
        return true; // No error if either value is not provided
      }
    ),
  automatic_reminder_email_days: Yup.string()
    .matches(
      /^([0-9]{1,2})(,\s?[0-9]{1,2})*$/,
      "Automatic Payment Reminder should only include numbers separated by commas (e.g., '3, 2, 1' or '3,2,1')."
    )
    .test(
      "is-descending",
      "Days should be entered in descending order (from largest to smallest).",
      (value) => {
        if (!value) return true; // Pass validation if the value is empty
        const numbers = value.split(",").map((num) => parseInt(num, 10)); // Parse numbers and trim spaces
        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i - 1] < numbers[i]) {
            return false; // Fail validation if not in descending order
          }
        }
        return true; // Pass validation if all checks succeed
      }
    )
    .test("no-duplicates", "Days should not repeat.", (value) => {
      if (!value) return true; // Pass validation if the value is empty
      const numbers = value.split(",").map((num) => parseInt(num, 10)); // Parse numbers and trim spaces
      const uniqueNumbers = new Set(numbers);
      return uniqueNumbers.size === numbers.length; // Fail if duplicates are found
    }),
  overdue_reminder_email_days: Yup.string()
    .matches(
      /^([0-9]{1,2})(,\s?[0-9]{1,2})*$/,
      "Automatic Payment Reminder should only include numbers separated by commas (e.g., '3,2,1')."
    )
    .test("no-duplicates", "Days should not repeat.", (value) => {
      if (!value) return true; // Pass validation if the value is empty
      const numbers = value.split(",").map((num) => parseInt(num, 10)); // Parse numbers
      const uniqueNumbers = new Set(numbers);
      return uniqueNumbers.size === numbers.length; // Fail if duplicates are found
    })
    .test(
      "is-ascending",
      "Days should be entered in ascending order (from smallest to largest).",
      (value) => {
        if (!value) return true; // Pass validation if the value is empty
        const numbers = value.split(",").map((num) => parseInt(num, 10)); // Parse numbers
        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i - 1] > numbers[i]) {
            return false; // Fail validation if not in ascending order
          }
        }
        return true; // Pass validation if all checks succeed
      }
    ),

  card_expiry_reminder_email_days: Yup.string()
    // .max(5, "Expiry Reminder can be at most three numbers separated by commas.")
    .matches(
      /^([0-9]{1,2})(,\s?[0-9]{1,2})*$/,
      "Automatic Payment Reminder should only include numbers separated by commas (e.g., '3,2,1')."
    )
    .test(
      "is-descending",
      "Days should be entered in descending order (from largest to smallest).",
      (value) => {
        if (!value) return true; // Pass validation if the value is empty
        const numbers = value.split(",").map((num) => parseInt(num, 10)); // Parse numbers
        for (let i = 1; i < numbers.length; i++) {
          if (numbers[i - 1] < numbers[i]) {
            return false; // Fail validation if not in descending order
          }
        }
        return true; // Pass validation if all checks succeed
      }
    )
    .test("no-duplicates", "Days should not repeat.", (value) => {
      if (!value) return true; // Pass validation if the value is empty
      const numbers = value.split(",").map((num) => parseInt(num, 10)); // Parse numbers
      const uniqueNumbers = new Set(numbers);
      return uniqueNumbers.size === numbers.length; // Fail if duplicates are found
    }),
  payment_retry_overdue_status_days: Yup.string()
    .transform((value) => value.replace(/^0+/, "")) // Trim leading zeros
    .matches(
      /^\d{1,2}$/, // Check if the number is between 0 and 99
      "Please enter a valid number of days (between 0 and 99)."
    ),
  payment_retry_suspended_status_days: Yup.string()
    .transform((value) => value.replace(/^0+/, "")) // Trim leading zeros
    .matches(
      /^\d{1,2}$/, // Check if the number is between 0 and 99
      "Please enter a valid number of days (between 0 and 99)."
    ),

  global_processing_fee: Yup.string().matches(
    /^(100|[1-9]?[0-9])$/,
    "The percentage cannot be greater than 100%."
  ),
  global_processing_fee_description: Yup.string()

    .max(50, "Description cannot exceed 50 characters."),
  // .required("Description is required"),
});

export {
  weakPasswordSchema,
  extremePasswordSchema,
  mediumPasswordSchema,
  highPasswordSchema,
  weakPasswordSchema1,
  extremePasswordSchema1,
  mediumPasswordSchema1,
  highPasswordSchema1,
  AddAgentGroupSchema,
  AddCardValidation,
  AddFilterSchema,
  AddNewTicketSchema,
  AddRoleSchema,
  AddSettingSubscription,
  AddUserValidationWeek,
  AddUserValidationExtreme,
  AddUserValidationHigh,
  AddUserValidationMedium,
  AgentGroupSchema,
  ChangePasswordValidationWeek,
  ChangePasswordValidationMedium,
  ChangePasswordValidationHigh,
  ChangePasswordValidationExtreme,
  EditUserValidation,
  EditUserValidationExtreme,
  EditUserValidationHigh,
  EditUserValidationMedium,
  FileValidation,
  KeyWordSchema,
  PasswordValidation,
  accManagerHideSchema,
  accManagerSchema,
  addClientSchema,
  changePasswordByAdminWeek,
  changePasswordByAdminExtreme,
  changePasswordByAdminHigh,
  changePasswordByAdminMedium,
  changePasswordByClientWeek,
  changePasswordByClientExtreme,
  changePasswordByClientHight,
  changePasswordByClientMedium,
  editAgentHideSchema,
  editAgentSchema,
  editClientHideSchema,
  editClientSchema,
  editMyProfileHideSchema,
  editMyProfileSchema,
  forgotPasswordSchema,
  AddBankValidation,
  kycByAdmin,
  AddSlackSchema,
  loginSchema,
  resetPassSchemaWeek,
  resetPassSchemaHigh,
  resetPassSchemaMedium,
  resetPassSchemaExtreme,
  EditBankValidation,
};
