const Joi = require("joi");
const pick = require("../util/pick");

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    console.log("error", errorMessage);
    // return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    return next(res.status(422).json({ error: errorMessage }));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;