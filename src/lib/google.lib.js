const axios = require("axios");
const { redirectGoogleURI } = require("../config/config");

const oauth2GoogleURL = "https://oauth2.googleapis.com/token";
const oauth2GoogleParams = {
  client_id: process.env.G_CLIENT_ID,
  client_secret: process.env.G_CLIENT_SECRET,
  redirect_uri: redirectGoogleURI,
  grant_type: "authorization_code",
};
const oauthGoogleHeaders = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
const oauth2GoogleResponse = async (code) => {
  const response = await axios.post(
    oauth2GoogleURL,
    { ...oauth2GoogleParams, code },
    oauthGoogleHeaders
  );
  return response.data;
};
const googleApi = async (token) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

module.exports = { oauth2GoogleResponse, googleApi };
