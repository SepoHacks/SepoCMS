const config = require("../config.json");

const vault = require("node-vault")({
  apiVersion: config.vault.apiVersion,
  endpoint: config.vault.endpoint,
  token: config.vault.token,
});

let statics = {};

const getSecrets = async () => {
  try {
    if (config.secretProvider === "vault") {
      if (!config.vault.static) {
        const [staticSecrets, mysqlTempSecrets] = await Promise.all([
          vault.read(config.vault.staticSecrets),
          vault.read(config.vault.mysqlTempSecrets),
        ]);

        const secrets = {
          DATABASE_HOST: staticSecrets.data.data.DATABASE_HOST,
          DATABASE_USER: mysqlTempSecrets.data.username,
          DATABASE_PASS: mysqlTempSecrets.data.password,
          DATABASE_NAME: staticSecrets.data.data.DATABASE_NAME,
          JWT_TOKEN: staticSecrets.data.data.JWT_TOKEN,
          JWT_REFRESH_TOKEN: staticSecrets.data.data.JWT_REFRESH_TOKEN,
        };

        statics = {
          JWT_TOKEN: staticSecrets.data.data.JWT_TOKEN,
          JWT_REFRESH_TOKEN: staticSecrets.data.data.JWT_REFRESH_TOKEN,
        };

        return secrets;
      } else {
        const staticSecrets = await vault.read(config.vault.staticSecrets);

        statics = {
          JWT_TOKEN: staticSecrets.data.data.JWT_TOKEN,
          JWT_REFRESH_TOKEN: staticSecrets.data.data.JWT_REFRESH_TOKEN,
        };

        return {
          DATABASE_HOST: staticSecrets.data.data.DATABASE_HOST,
          DATABASE_USER: staticSecrets.data.data.DATABASE_USER,
          DATABASE_PASS: staticSecrets.data.data.DATABASE_PASS,
          DATABASE_NAME: staticSecrets.data.data.DATABASE_NAME,
          JWT_TOKEN: staticSecrets.data.data.JWT_TOKEN,
          JWT_REFRESH_TOKEN: staticSecrets.data.data.JWT_REFRESH_TOKEN,
        };
      }
    } else if (config.secretProvider === "native") {
      statics = {
        JWT_TOKEN: config.native.JWT_TOKEN,
        JWT_REFRESH_TOKEN: config.native.JWT_REFRESH_TOKEN,
      };

      return {
        DATABASE_HOST: config.native.DATABASE_HOST,
        DATABASE_USER: config.native.DATABASE_USER,
        DATABASE_PASS: config.native.DATABASE_PASS,
        DATABASE_NAME: config.native.DATABASE_NAME,
        JWT_TOKEN: config.native.JWT_TOKEN,
        JWT_REFRESH_TOKEN: config.native.JWT_REFRESH_TOKEN,
      };
    } else if (config.secretProvider === "env") {
      statics = {
        JWT_TOKEN: process.env.JWT_TOKEN,
        JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
      };

      return {
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_USER: process.env.DATABASE_USER,
        DATABASE_PASS: process.env.DATABASE_PASS,
        DATABASE_NAME: process.env.DATABASE_NAME,
        JWT_TOKEN: process.env.JWT_TOKEN,
        JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
      };
    } else {
      throw new Error("Invalid secret provider");
    }
  } catch (error) {
    throw new Error("Error fetching secrets from Vault!");
  }
};

const getStaticSecrets = () => {
  return statics;
};

module.exports = {
  config,
  getSecrets,
  getStaticSecrets,
};
