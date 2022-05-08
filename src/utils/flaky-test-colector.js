const fs = require("fs");
const csv = require("fast-csv");
const getStream = require("get-stream");
const ObjectsToCsv = require("objects-to-csv");

// TODO: identificar casos de testes que foi alterado pelo commit e obter os tokens de cada caso de teste
// TODO : checar unclassified_flakies
// Duvidas: fazer checkout no commit pra incluir o fix ou antes pra nao incluir
// ordem : commit/pull/issue

exports.classify_flaky_csv = () =>
  new Promise((resolve, reject) =>
    Promise.resolve().then(filterNodejsProjects).then(resolve).catch(reject)
  );

const filterNodejsProjects = () =>
  new Promise((resolve, reject) => {
    return getStream
      .array(
        fs
          .createReadStream(`${__dirname}/../../datasets/dataset.csv`)

          .pipe(csv.parse({ headers: true }))
      )
      .then(addEmptyColumns)
      .then((data) => {
        if (data.length > 0) {
          console.log(data.length);
          const flakies_nodejs = data.filter(
            (e) =>
              !e.URL.includes("android") &&
              !e["Tests/Code Affected (to Reproduce)"]
                .toString()
                .includes("android")
          );
          const csv = new ObjectsToCsv(flakies_nodejs);
          const dirName = `${__dirname}/../../datasets/fix-flaky-nodejs.csv`;
          return csv
            .toString(true) // remove header
            .then((data) => fs.appendFileSync(dirName, data, "utf8"))
            .then(() => "File save with success")
            .catch((err) => {
              console.log(err);
              throw err;
            });
        }
      })
      .then(resolve)
      .catch(reject);
  });

const addEmptyColumns = (data) =>
  data.map((e) => {
    e.linha_inicio = "";
    e.linha_fim = "";
    return e;
  });
/*

const { checkout } = require("./shell");
const { dirname } = require("path");

const filterCSv = () =>
  new Promise((resolve, reject) => {
   const flaky_pull_request = [];
    const flaky_issues = [];
    const flaky_commits = [];
    const unclassified_flakies = [];

             return Promise.all(
            data.map((row) => {
              const { URL: url } = row;
              if (url.includes("/pull/")) {
                flaky_pull_request.push(row);
              } else if (url.includes("/issues/")) {
                flaky_issues.push(row);
              } else if (url.includes("/commit/")) {
                flaky_commits.push(row);
              } else {
                unclassified_flakies.push(row);
              }
            })
          );
          
        })
        .then(async (data) => {
        

        const flakies_commits_javascript = flaky_commits.filter(
            (e) =>
              !e.URL.includes("android") &&
              !e["Tests/Code Affected (to Reproduce)"]
                .toString()
                .includes("android")
          );
        
        fs.createWriteStream(
          `${__dirname}/../../datasets/dataset.csv`,
          true
        );

        // Download projects

        const projects_to_download = flakies_javascript.map((e) => {
          const array = e.URL.split("/commit/");
          const project_name = array[0];
          return project_name.substring(19);
        });

        const projects = [...new Set(projects_to_download)]; // remove duplicated data
        // Remove comment if u want download projects
        console.log(projects, "Download projects with flaky fix commits");
        await download_files(projects);
    

        // Checkout fix flaky pulls
        const js_files_blob = flakies_javascript.filter(e => {
          const test_affected = e["Tests/Code Affected (to Reproduce)"];
          return test_affected.includes('/blob/') && test_affected.includes('.js');
        });

        console.log(js_files_blob.length);

        return Promise.all(flaky_tests_contents = js_files_blob.map(e => {
          const test_affected = e["Tests/Code Affected (to Reproduce)"];
          const url = e["URL"];
          const check = url.split('/commit/')[1];
          const arr = test_affected.split('/blob/');
          const project_name = arr[0].substring(19);
          const flaky_localization = `${project_name}${arr[1].toString().substring(40)}`;

          return checkout(project_name, check).then(() => {
            return 'success checkout'
          });

        }));
              })
          */
