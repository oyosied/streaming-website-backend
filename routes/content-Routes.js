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
} = require("../controllers/content-controllers");
const router = express.Router();

const idSchema = Joi.number().integer().required();
function validateSeriesId(req, res, next) {
  const seriesId = decodeURIComponent(req.params.series_id);
  console.log(seriesId);
  const { error } = idSchema.validate(seriesId);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
}
function validateEpisodeId(req, res, next) {
  const episodeId = decodeURIComponent(req.params.episode_id);
  console.log(req.params);
  const { error } = idSchema.validate(episodeId);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
}

router.use(validateTokenWithNext);
router.get("/series/:series_id", validateSeriesId, get_series);
router.get("/episode/:episode_id", validateEpisodeId, get_episode);
router.get("/series/:series_id/seasons", validateSeriesId, get_seasons);
router.get("/genres", get_genres);
router.use((req, res) => {
  res.status(404).json({ message: "No such API" });
});
module.exports = router;
