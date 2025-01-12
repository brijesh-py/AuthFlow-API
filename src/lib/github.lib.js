const axios = require("axios");

const oauthGithubURL = "https://github.com/login/oauth/access_token";
const oauthGithubParams = {
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
};
const oauthGithubHeaders = {
  headers: { Accept: "application/json" },
};

const githubResponse = async (code) => {
  const response = await axios.post(
    oauthGithubURL,
    { ...oauthGithubParams, code },
    oauthGithubHeaders
  );
  return response.data;
};

const getGithubEmail = async (token) => {
  const response = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data[0]?.email;
};

const githubApi = async (token) => {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const { login, id, avatar_url } = response.data;
  return { login, id, avatar_url, email: await getGithubEmail(token) };
};

module.exports = { githubResponse, githubApi };
