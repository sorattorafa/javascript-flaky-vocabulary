
const { get_test_tokens } = require("./utils/test-code-tokenizer");

get_test_tokens()
        .then(() => rl.close())
        .catch(console.log);
