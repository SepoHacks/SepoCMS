const vault = require("node-vault");

const vaultOptions = {
  apiVersion: "v1",
  endpoint: "http://192.168.122.105:8200",
  token: "root",
};

const secrets = {};

async function fetchSecrets() {
  try {
    const client = vault(vaultOptions);
    const result = await client.read("secret/data/sepocms");

    if (result && result.data && result.data.data) {
      Object.assign(secrets, result.data.data);
    } else {
      throw new Error("Invalid data format received from Vault");
    }
  } catch (err) {
    console.error("Error fetching secrets:", err);
    throw err;
  }
}

module.exports = {
  fetchSecrets,
  secrets,
};