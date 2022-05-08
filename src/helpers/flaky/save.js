const fs = require("fs");
const { checkout, clone_repo } = require("../../helpers/git");

async function get_flaky_test(project_name, row) {
  const test_affected = row["Tests/Code Affected (to Reproduce)"];
  const arr = test_affected.split("/blob/");
  const blob = arr[1].split("/")[0];

  const flaky_file = arr[1].toString().substring(40).split(" ").join("");

  // flaky localization without whitespace
  const flaky_localization =
    `${__dirname}/../../../downloads_flaky/${project_name}${flaky_file}`.replace(
      /\s/g,
      ""
    );

  console.log({
    project_name,
    flaky_file,
    flaky_localization,
    blob,
  });

  return (
    Promise.resolve()
      //.then(() => clone_repo(project_name, `./downloads_flaky/${project_name}`))
      .then(() => checkout(project_name, blob, project_name))
      .then(() => {

        if (!fs.existsSync(flaky_localization)) {
          throw new Error(`${flaky_localization} does not exist`);
        }

        const contents = fs.readFileSync(flaky_localization, "utf8")

        const datacontents = contents.split(/\r?\n/);

        let data = `// ${test_affected} \n
          // blob: ${blob} \n
          // project_name: ${project_name} \n  
          // flaky_file: ${flaky_file} \n 
          // test_affected: ${test_affected} \n `;

        for (var i = 1; i < 10; i++) {
          var start_line = row[`test${i}_start_line`];
          var end_line = row[`test${i}_end_line`];

          if (start_line != "" &&
            end_line != "" &&
            start_line != " " &&
            end_line != " ") {
            data += `// start_line: ${start_line} \n`;
            data += `// end_line: ${end_line} \n`;

            start_line = start_line.replace(/[^0-9]/g, "");
            end_line = end_line.replace(/[^0-9]/g, "");
            start_line = parseInt(start_line);
            end_line = parseInt(end_line);

            for (var j = start_line; j <= end_line; j++) {
              let linha = datacontents[j - 1];
              data += linha + "\n";
            }
          }
        }

        const formated_flaky_file = flaky_file.split("/").join("_");

        var formated_project_name = project_name.split("/").join("_");
        formated_project_name = formated_project_name.split(".").join("_");

        var saved_folder_name = `${__dirname}/../../../datasets/flaky_tests/${formated_project_name}/${blob}`;

        if (!fs.existsSync(saved_folder_name)) {
          fs.mkdirSync(saved_folder_name, { recursive: true }, (err) => { });
        }

        return fs.writeFileSync(
          saved_folder_name + '/' + formated_flaky_file,
          data
        );
      })
      .then(() => {
        console.log("finish");
        return 'success';
      })
      .catch((e) => {
        console.log('falha ao coletar flaky test', e);
        return `error : ${e}`;
        //   throw new Error('falha ao coletar flaky test');
      })
  );

}

exports.get_flaky_test = get_flaky_test;
