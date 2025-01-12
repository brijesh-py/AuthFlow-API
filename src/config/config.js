const redirectGoogleURI = `http://localhost:${process.env.PORT}/auth/google/callback`;
const redirectGithubURI = `http://localhost:${process.env.PORT}/auth/github/callback`;

const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.G_CLIENT_ID}&redirect_uri=${redirectGoogleURI}&response_type=code&scope=profile email`;

const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectGithubURI}&scope=user,gist,user:email`;

module.exports = {
  googleAuthURL,
  redirectGoogleURI,
  githubAuthURL,
  redirectGithubURI
};
