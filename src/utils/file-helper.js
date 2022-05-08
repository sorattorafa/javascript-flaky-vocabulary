const fs = require("fs");
const { getTokensByTest, getTokensByNormalTest } = require("./get_tokens_by_node");
const glob = require("glob-promise");
const { get_repo_actual_tag } = require("../helpers/git");

exports.get_tests_filenames = get_tests_filenames = async (repos_array) => {
  var repo_test_files = [];

  await Promise.all(repos_array.map(async (repo) => {
    const repo_info = repo.split("/");
    //const availables_test_folders = fs.readFileSync('./configs/availables-test-folders.txt').toString().split("\r\n")
    tests_names = [
      ...(await glob(`**/downloads_flaky/${repo}/**/**.spec.js`)),
      ...(await glob(`**/downloads_flaky/${repo}/**/**.spec.ts`)),
      ...(await glob(`**/downloads_flaky/${repo}/**/**.test.js`)),
      ...(await glob(`**/downloads_flaky/${repo}/**/**.test.ts`)),
    ]


    if (tests_names.length >= 1) {
      const repo_data = {
        name: repo_info[1],
        author: repo_info[0],
        test_filenames: tests_names,
      };
      repo_test_files.push(repo_data);
    }
  }));

  return repo_test_files;
};

exports.get_tests_files_contents = get_tests_files_contents = async (repos) => {
  const tests_contents = [];
  await Promise.all(repos.map(async (repo) => {
    const test_files = repo.test_filenames;
    const repo_name = repo.author + '/' + repo.name;
    const tag = await get_repo_actual_tag(repo_name);
    const oid = tag.oid;
    for (var j = 0; j < test_files.length - 1; j += 1) {
      const file = test_files[j];
      const test_filename = 'https://github.com/' + repo_name + '/blob/'+ oid + file.split('downloads_flaky/' + repo_name)[1];
      tests_contents.push({
        project_name: repo.name,
        project_author: repo.author,
        name: test_filename,
        contents: fs.readFileSync(file, "utf8"),
        commit: oid,
      });
    };
  }));
  return tests_contents;
};


exports.save_response = save_response = async (response) => {
  var test_rows = [];
  await Promise.all(
    response.map((data) => {
      if (data.length <= 0)
        return;

      for (var ti = 0; ti < data.length; ti += 1) {
        const test_item = data[ti];
        const new_row = {
          URL: test_item.file,
          project_name: test_item.project_name,
          project_author: test_item.project_author,
          commit: test_item.commit,
          is_flaky: false,
          tokens: test_item.tokens,
        };
        test_rows.push(new_row);
      }
    })
  );
  const normalTestsJSON = JSON.stringify(test_rows, null, 2);
  return fs.writeFileSync(`./datasets/tests/normal-tests.json`, normalTestsJSON);
};

exports.get_tokens_by_test = get_tokens_by_test = (tests_contents) =>
  tests_contents.map((test) => getTokensByTest(test));


exports.get_tokens_by_normal_test = get_tokens_by_normal_test = (tests_contents) =>
  tests_contents.map((test) => getTokensByNormalTest(test));