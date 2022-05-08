const { clone_repo } = require("../helpers/git");

exports.download_files = download_files = (repos_array) =>
  Promise.all(
    repos_array.map((repo) => clone_repo(repo, `./downloads/${repo}`))
  );
