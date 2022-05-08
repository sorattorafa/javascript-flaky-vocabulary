const {
  get_tests_filenames,
  get_tests_files_contents,
  get_tokens_by_test,
  get_tokens_by_normal_test,
  save_response,
} = require("./file-helper");

const { clone_repo } = require("../helpers/git");
const { download_files } = require("./download-files");

// DONE: Identificar pela árvore um caso de teste:
// DONE: Identificar um nó
// DONE: Identificar se um nó é um método de teste (utilizar describe, tests e etcs por enquanto)
// DONE: Criar uma lista de tokens por nó
// DONE: Salvar em um csv no seguinte formato: file_name, nome repo, nome autor, test_nickname, test start line, test end line, test start column, test end column
// TODO: LIMPAR O CSV ANTES DE INSERIR DADOS
// DONE: CRIAR ARQUIVOS DE ENTRADA DE CONFIRGURACOES COM (ARRAY DE NOMES DE PASTAS DE TESTE, ARRAY DE IDENTIFICADORES DE TESTE)
// DONE: EXECUTAR CÓDIGO SOMENTE PARA 1 PROJETO (DEVE-SE POSSIBILITAR 1 OU N)
var fs = require("fs");

const { checkout } = require('../helpers/git');

var repos_array;

exports.get_test_tokens = () =>
  new Promise((resolve, reject) =>
    Promise.resolve(repos_array)
      .then(() => {
        repos_array = fs
          .readFileSync("./configs/repositories.txt")
          .toString()
          .split("\r\n");
        return repos_array;
      })
      .then(async repos => {
    /*
        await Promise.all(repos.map(repo => {
          return clone_repo(repo, "main")s
        }));
    */
        return repos_array;
      })
      .then(repos_array => get_tests_filenames(repos_array))
      .then(get_tests_files_contents)
      .then(get_tokens_by_normal_test)
      .then(save_response)
     // .then(console.log)
      .then(resolve)
      .catch((err) => {
        console.log(err);
        reject(err);
      })
  );
