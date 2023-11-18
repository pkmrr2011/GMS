
const validator = require("validator");
const { check, validationResult } = require("express-validator");

exports.validation = (req, res, next) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
        return this.handleError(res, this.buildErrObject(422, err.array()));
    }
  };

  exports.handleError = (res, err) => {
    res.status(err.code).json({
      errors: {
        msg: err.message,
      },
      code: err.code,
    });
  };
  
  exports.buildErrObject = (code, message) => {
    return {
      code,
      message,
    };
  };

exports.login = [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.addUser = [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("name")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.user_id = [
    check("user_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.site_id = [
    check("site_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.job_id = [
    check("job_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.addJob = [
    check("user_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("site_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.register = [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("user_name")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("full_name")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];


  exports.sendOtp = [
    check("user_name")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.forgetPassword = [
    check("user_name")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("otp")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.startDuty = [
    check("job_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("site_id")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.addIncident = [
    check("incident_images")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("incident_comment")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.endDuty = [
    check("daily_report_images")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("daily_report_comment")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];

  exports.addDailyReport = [
    check("daily_report_images")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("daily_report_comment")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    (req, res, next) => {
        this.validation(req, res, next);
    },
  ];