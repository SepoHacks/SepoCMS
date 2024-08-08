const config = require("../config.json");

const vault = require("node-vault")({
  apiVersion: config.vault.apiVersion,
  endpoint: config.vault.endpoint,
  token: config.vault.token,
});

const getDatabaseSecrets = async () => {
  if (config.secretProvider === "vault") {
    try {
      const secret = await vault.read("???");
      return secret.data;
    } catch (error) {
      console.error("Error fetching secrets from Vault:", error);
      throw error;
    }
  } else if (config.secretProvider === "native") {
    return {
      DATABASE_HOST: config.native.DATABASE_HOST,
      DATABASE_USER: config.native.DATABASE_USER,
      DATABASE_PASS: config.native.DATABASE_PASS,
      DATABASE_NAME: config.native.DATABASE_NAME,
    };
  } else {
    throw new Error("Invalid secret provider");
  }
};

module.exports = {
  config,
  getDatabaseSecrets,
};
