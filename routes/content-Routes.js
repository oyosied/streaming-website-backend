const express = require("express");
const Joi = require("@hapi/joi");
const {
  validateTokenWithNext,
} = require("../middleware/validators/validator.js");
const {
  get_episode,
  get_series,
  get_genres,
  get_seasons,
  get_series_by_genres,
} = require("../controllers/content-controllers");
const router = express.Router();

const idSchema = Joi.number().integer().required();

function validateId(paramName, req, res, next) {
  const id = decodeURIComponent(req.params[paramName]);
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
}

router.use(validateTokenWithNext);
router.get(
  "/series/:series_id",
  validateId.bind(null, "series_id"),
  get_series
);
router.get(
  "/episode/:episode_id",
  validateId.bind(null, "episode_id"),
  get_episode
);
router.get(
  "/series/:series_id/seasons",
  validateId.bind(null, "series_id"),
  get_seasons
);
router.get(
  "/genres/:genre_id",
  validateId.bind(null, "genre_id"),
  get_series_by_genres
);
router.get("/genres", get_genres);
router.use((req, res) => {
  res.status(404).json({ message: "No such API" });
});

module.exports = router;
