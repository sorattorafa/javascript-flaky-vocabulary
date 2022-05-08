const readline = require("readline");
const fs = require("fs");
const { checkout, clone_repo } = require("./helpers/git");
const { parse } = require("@typescript-eslint/typescript-estree");
const { get_test_tokens } = require("./utils/test-code-tokenizer");
const { classify_flaky_csv } = require("./utils/flaky-test-colector");
const { getTokensByTest } = require("./utils/get_tokens_by_node");
const { get_flaky_test } = require("./helpers/flaky/save");
const { flaky_parser } = require("./helpers/flaky/parse");

const getStream = require("get-stream");

const csv = require("fast-csv");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


class GithubTestCollector {
  constructor() {}

  get_tokens_from_repositories() {
      return get_test_tokens();
  }

  get_flaky_tokens_from_commits() {
    return get_flaky_tests_interface(); 
  }
}


const gtc = new GithubTestCollector();

rl.question(
  `Welcome to code-tokenizer, please select option: \n 
  1) Code tokenizer \n
  2) Classify Ui flaky tests \n
  3) Download repositories \n
  4) Make checkout into repositorie \n ,
  5) Parse JavaScript Code \n ,
  6) GET FLAKY TESTS \n ,
  7) PARSE FLAKY TESTS \n `,

  (opt) => {
    if (opt == 1) {
      return gtc.get_tokens_from_repositories()
        .then(() => rl.close())
        .catch(console.log);
    } else if (opt == 2) {
      return classify_flaky_csv()
        .then(() => console.log("finish"))
        .catch(console.log)
        .finally(() => rl.close());
    } else if (opt == 3) {
      return Promise.resolve()
        .then(() =>
          fs.readFileSync("./configs/repositories.txt").toString().split("\n")
        )
        .then((repos_array) => download_files(repos_array))
        .catch(console.log)
        .finally(() => rl.close());
    } else if (opt == 4) {
      rl.question(`enter with repo and checkout id with , separator`, (opt) => {
        const [repo, checkoutId] = opt.split(",");

        return Promise.resolve()
          .then(() => checkout(repo, checkoutId))
          .catch(console.log)
          .finally(() => rl.close());
      });
    } else if (opt == 5) {
      return Promise.resolve()
        .then(() => fs.readFileSync("./configs/jsexample.js", "utf8"))
        .then((contents) => {
          return getTokensByTest({ contents });
        })
        .then((result) => {
          const data = JSON.stringify(result, null, 2);
          return fs.writeFileSync(`./datasets/tests/test.json`, data);
        })
        .catch(console.log)
        .finally(() => rl.close());
    } else if (opt == 6) {
      return get_flaky_tests_interface();

    } else if (opt == 7) {
      return parse_flaky_tests_interface();
    }
  }
);

async function parse_flaky_tests_interface() {
  return Promise.resolve()
    .then(() => getStream.array(
      fs
        .createReadStream(`${__dirname}/../datasets/identified-flaky.csv`)
        .pipe(csv.parse({ headers: true }))
    )).then((result) => {
      var flaky_array = [];
      result.map(e => {
        var flakies = flaky_parser(e);
        flakies.map(e => {
          flaky_array.push(e);
        });
      });
      return flaky_array;
    })
    .then(result => {
      const data = JSON.stringify(result, null, 2);
      return fs.writeFileSync(`${__dirname}/../datasets/flaky_json/tests/flaky-parsed.json`, data);
    })
    .then(() => rl.close())
    .catch(console.log);
}

async function get_flaky_tests_interface() {
  return getStream
    .array(
      fs
        .createReadStream(`${__dirname}/../datasets/identified-flaky.csv`)
        .pipe(csv.parse({ headers: true }))
    )
    .then((result) => Promise.all(result.map((row) => get_flaky_from_test_affected(row))))
    .then(console.log)
    .then(() => rl.close());

}
async function get_flaky_from_test_affected(row) {
  const { "Tests/Code Affected (to Reproduce)": test_affected, URL } = row;

  var array;

  if (URL.includes("pull")) {
    array = URL.split("/pull/");
  } else if (URL.includes("commit")) {
    array = URL.split("/commit/");
  } else if (URL.includes("issues")) {
    array = URL.split("/issues/");
  }

  const project_name = array[0].split("https://github.com/")[1];

  if (
    test_affected.includes("/blob/") &&
    row["is_test_code"].toString().includes("true")
  ) {
    if (test_affected.includes(";")) {
      console.log('não é teste');
      throw new Error('nao é teste');
    }
    return get_flaky_test(project_name, row);
  }
  console.log('não é teste');
}

rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});

// verificar denovo:
// test(angular1): Temporarily comment out flaky test,https://github.com/OnsenUI/OnsenUI/commit/e5f3e1a0e11a2f9aa97b0fca65d1a5544b6276dc, Flaky behavior with DOM selectors,DOM Selector Issue,https://github.com/OnsenUI/OnsenUI/blob/e5f3e1a0e11a2f9aa97b0fca65d1a5544b6276dc/bindings/angular1/test/e2e/dialog/scenarios.js, CircleCI,Unspecified,Commented out,Remove Test, ,false , 22, 43,