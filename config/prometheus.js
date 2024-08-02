const prom = require("prom-client");

prom.collectDefaultMetrics({ timeout: 15000 });

const httpRequestCount = new prom.Counter({
  name: "sepocms_http_requests_total",
  help: "Total HTTP req counts",
  labelNames: ["method", "route"],
});

const loginCount = new prom.Counter({
  name: "sepocms_login_total",
  help: "Total Logins",
  labelNames: ["status"],
});

const registerCount = new prom.Counter({
  name: "sepocms_register_total",
  help: "Total Registers",
  labelNames: ["status"],
});

const authCount = new prom.Counter({
  name: "sepocms_auth_total",
  help: "Total auths",
  labelNames: ["status", "method", "route", "type"],
});

module.exports = {
  httpRequestCount,
  loginCount,
  prom,
  registerCount,
  authCount,
};
