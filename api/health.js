// Função serverless do Vercel — healthcheck
module.exports = (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "beatriz-nutri",
    time: new Date().toISOString(),
  });
};
