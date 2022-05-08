const fs = require("fs");

const { getTokensByTest } = require("../../utils/get_tokens_by_node");

exports.flaky_parser = (row) => {
  let jsons = [];
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
      throw new Error('nao é teste');
    }
    else {
      const test_affected = row["Tests/Code Affected (to Reproduce)"];
      const arr = test_affected.split("/blob/");
      const blob = arr[1].split("/")[0];
      const flaky_file = arr[1].toString().substring(40).split(" ").join("");
      var formated_project_name = project_name.split("/").join("_");
      formated_project_name = formated_project_name.split(".").join("_");
      const formated_flaky_file = flaky_file.split("/").join("_");
      var saved_folder_name = `${__dirname}/../../../datasets/flaky_tests/${formated_project_name}/${blob}/${formated_flaky_file}`;
      // console.log(saved_folder_name);
      if (!fs.existsSync(saved_folder_name)) {
        throw new Error(`${saved_folder_name}`);
      } else {

        const contents = fs.readFileSync(saved_folder_name, "utf8")

        const datacontents = contents.split(/\r?\n/);

        for (let i = 0; i < datacontents.length; i++) {
          const line = datacontents[i];
          const next_line = datacontents[i + 1];

          if (line.includes("start_line")) {

            const start_line = line.split("// start_line: ")[1].split(" ").join("");
            const end_line = next_line.split("// end_line: ")[1].split(" ").join("");
            /// Create json
            const json = {};
            json.URL = test_affected;
            json.commit = blob;
            const splited_project = project_name.split("/");
            json.project_name = splited_project[1];
            json.project_author = splited_project[0];
            json.flaky_file = flaky_file;
            json.start_line = parseInt(start_line);
            json.end_line = parseInt(end_line);
            json.is_flaky = true;

            const dif = json.end_line - json.start_line;
            let data = '';

            for (let j = 0; j <= dif; j++) {
              data += datacontents[j + i + 2] + '\n';
            }

            // const [tokens_infos] = getTokensByTest({ contents: data });
            const tokens = getTokensByTest({ contents: data });

            json.test_code = data;

            if (tokens) {
              json.tokens = tokens;
              //json.tokens_infos = tokens_infos.infos;
              if (json.tokens) {
                jsons.push(json);
              }
            }
          }
        }
      }
    }
  }
  return jsons;
}