const DB = require("../utils/DB.js");
const ServerManager = require("../utils/Managers/ServerManager.js");

const get_episode = async (req, res) => {
  const episode_id = req.params.episode_id;
  const result = await DB.query(
    "Get episode",
    "SELECT * FROM episodes WHERE id = ?",
    [episode_id]
  );

  if (result.error) {
    res.status(500).send({ error: "Error fetching episode data" });
    return;
  }

  if (result.results.length === 0) {
    res.status(404).send({ error: "Episode not found" });
    return;
  }

  res.status(200).json({ episode: result.results[0] });
};

const get_series = async (req, res) => {
  const series_id = req.params.series_id;
  const result = await DB.query(
    "Get series and episodes",
    "SELECT * FROM series WHERE id = ?",
    [series_id]
  );
  if (result.error) {
    res.status(500).send({ error: "Error fetching series data" });
    return;
  }

  if (result.results.length === 0) {
    res.status(404).send({ error: "Series not found" });
    return;
  }
  const series = result.results[0];

  res.status(200).json({ series });
};

const get_seasons = async (req, res) => {
  const series_id = req.params.series_id;
  const seasons_result = await DB.query(
    "Get seasons",
    "SELECT * FROM seasons WHERE series_id = ? ORDER BY season_number",
    [series_id]
  );
  if (seasons_result.error) {
    res.status(500).send({ error: "Error fetching seasons data" });
    return;
  }

  if (seasons_result.results.length === 0) {
    res.status(404).send({ error: "Seasons not found" });
    return;
  }
  let seasons_and_episodes = [];
  for (const season of seasons_result.results) {
    const season_episodes = await DB.query(
      "Get seasons's episodes",
      "SELECT * FROM episodes WHERE series_id = ? AND season_id = ? ORDER BY episode_number",
      [series_id, season["id"]]
    );
    if (season_episodes.error) {
      res.status(500).send({ error: "Error fetching season's episodes data" });
      return;
    }

    season.episodes = season_episodes.results;
    seasons_and_episodes.push(season);
  }
  res.status(200).json({ seasons_and_episodes });
};

const get_genres = async (req, res) => {
  const result = await DB.query("Get genres", "SELECT * FROM genres");
  if (result.error) {
    res.status(500).send({ error: "Error fetching genres" });
    return;
  }

  if (result.results.length === 0) {
    res.status(404).send({ error: "Genres not found" });
    return;
  }
  res.status(200).json({ genres: result.results });
};

exports.get_episode = get_episode;
exports.get_series = get_series;
exports.get_genres = get_genres;
exports.get_seasons = get_seasons;
