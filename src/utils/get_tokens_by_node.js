const { parse } = require('@typescript-eslint/typescript-estree');
var fs = require("fs");

exports.getTokensByTest = (test) => {
  const contents = test.contents;

  const accept_tests_keywords = fs.readFileSync('./configs/availables-test-names.txt').toString()
    .split("\n").map((keyword) => {
      if (keyword.includes('\r')) {
        return keyword.split('\r')[0];
      }
      return keyword;
    });

  var body, tokens;

  try {
    const { body: resultBody, tokens: resultTokens } = parse(
      contents,
      {
        tokens: true,
        loc: true,
        range: true,
        jsx: true,
      },
      function (node, meta) { }
    );
    body = resultBody;
    tokens = resultTokens;
  } catch (err) {
    // console.log(err);
    return [];
  }

  //  const accept_tokens_type =  ["Identifier", "Keyword", "String", "Numeric", "Null", "RegularExpression", "Boolean", "Template"];
  const not_accept_tokens = ["Punctuator"];

  const accept_tokens = tokens.filter(
    (token) => !not_accept_tokens.includes(token.type)
  );

  return accept_tokens.map((token) => ({ value: token.value, type: token.type }));

};



exports.getTokensByNormalTest = (test) => {
  const contents = test.contents;

  const accept_tests_keywords = fs.readFileSync('./configs/availables-test-names.txt').toString()
    .split("\n").map((keyword) => {
      if (keyword.includes('\r')) {
        return keyword.split('\r')[0];
      }
      return keyword;
    });

  var body, tokens;

  try {
    const { body: resultBody, tokens: resultTokens } = parse(
      contents,
      {
        tokens: true,
        loc: true,
        range: true,
        jsx: true,
      },
      function (node, meta) { }
    );
    body = resultBody;
    tokens = resultTokens;
  } catch (err) {
    // console.log(err);
    return [];
  }

  //  const accept_tokens_type =  ["Identifier", "Keyword", "String", "Numeric", "Null", "RegularExpression", "Boolean", "Template"];
  const not_accept_tokens = ["Punctuator"];

  const accept_tokens = tokens.filter(
    (token) => !not_accept_tokens.includes(token.type)
  );

  var tokens_by_test = [];

  /*const test_quantity = accept_tokens.filter(
    (token) =>
      token.type == "Identifier" &&
      accept_tests_keywords.includes(token.value)
  ).length;
  */

  var test_quantity = 0;
  for(var t = 0; t < accept_tokens.length; t++){
    to = accept_tokens[t];
    next_to = accept_tokens[t+1];
    if(to.type == "Identifier" && accept_tests_keywords.includes(to.value)){
      if(next_to != null && next_to.type == 'String'){
        test_quantity++;
      }
    }
  }


  var checked_tests = 0;

  if (test_quantity > 0) {
    console.log(test.name, 'test_quantity', test_quantity);
    for (var i = 0; i < accept_tokens.length; i++) {
      var actual_token = accept_tokens[i];
      var next_token = accept_tokens[i+1];
      if (
        actual_token.type == "Identifier" &&
        accept_tests_keywords.includes(actual_token.value) &&
        next_token != null && next_token.type == 'String' &&
        checked_tests <= test_quantity - 1
      ) {
        checked_tests += 1;
        var j = i;
        const start_line = accept_tokens[j+1].loc.start.line;
        var tokens_buffer = [];
        const final_of_tests = [...accept_tests_keywords, 'describe']
        while (
          accept_tokens[j + 1] &&
          !final_of_tests.includes(accept_tokens[j + 1].value)
        ) {
          j = j + 1;
          tokens_buffer.push({
            value: accept_tokens[j].value,
            type: accept_tokens[j].type,
          });
        } 
        const end_line = accept_tokens[j].loc.start.line +1;
        const new_object = {
          tokens: tokens_buffer,
          project_name: test.project_name,
          project_author: test.project_author,
          file: test.name,
          commit: test.commit,
          start_line: start_line,
          end_line: end_line,
        };
  
        tokens_by_test.push(new_object);
        tokens_buffer = [];
      }
    }
  }

  return tokens_by_test;

};
