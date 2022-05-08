const fs = require("fs");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
require('dotenv').config()


let auth = {
  headers: {
    'X-Authentication': `Bearer ${process.env.token}`,
  }
}

async function get_repo_actual_tag(url) {
  const folder = `./downloads_flaky/${url}`;
  const REPO = "https://github.com/" + url;
  let tags = await git.listServerRefs({ fs, dir: folder, http, remote: "origin", url: REPO })
    .catch((err) => console.error("failed: ", err));
  if (tags?.length > 0) {
    return tags[0];
  }
}

async function clone_repo(url) {
  const REPO = "https://github.com/" + url;
  const folder = `./downloads_flaky/${url}`;
  if (fs.existsSync(folder)) {
    fs.rmSync(folder, { recursive: true }, (err) => console.log(err));
  }
  return await git.clone({
    fs,
    http,
    dir: folder,
    url: REPO,
    onAuth: () => auth,
    singleBranch: true,
    depth: 1
  }).catch((err) => console.error("failed: ", err));
}

async function checkout(repo, checkout_id) {
  return new Promise((resolve, reject) => {

    const folder = `./downloads_flaky/${repo}`;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true }, (err) => console.log(err));
    }

    return (
      Promise.resolve()
        .then(() => git.init({ dir: folder, fs, defaultBranch: checkout_id }))
        .then(() =>
          git.fetch({
            dir: folder,
            http,
            fs,
            remote: "origin",
            remoteRef: checkout_id,
            ref: checkout_id,
            depth: 1,
            singleBranch: true,
            pruneTags: true,
            tags: false,
          })
        )
        .then(() =>
          git.checkout({
            fs,
            dir: folder,
            ref: checkout_id,
            noUpdateHead: true,
            force: true,
          })
        )
        .then(resolve)
        .catch(reject)
    );
  });
}

exports.clone_repo = clone_repo;
exports.checkout = checkout;
exports.get_repo_actual_tag = get_repo_actual_tag;