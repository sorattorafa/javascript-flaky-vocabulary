<h1 align="center">Vocabulary of flaky tests in Javascript</h1>
<p href="#descricao" align="center">XXII Brazilian Symposium on Software Quality (SBQS ’23), November 7–10, 2023, Brasília, Brazil</p>

# Vocabulary of Flaky Tests in Javascript

**Abstract**: 

*Context: Regression testing is a software verification and valida-
tion activity in modern software engineering. In this activity, tests
can fail without any implementation change, characterizing a flaky
test. Flaky tests may delay the release of the software and reduce
testing confidence. One way to identify flaky tests is by re-running
the tests, but this has a high computational cost. An alternative
to re-execution is the static analysis of the code of the test cases,
identifying patterns related to flaky tests. Objective: The objective
of this work was to identify flaky tests in Javascript applications
by analyzing the source code of the test cases, without executing
them. Method: A dataset was built with flaky test cases extracted
from open source software hosted on GitHub and implemented
in Javascript. Then, a classification model and a flakiness vocab-
ulary were created, considering the source code of flaky tests in
the Javascript language. Results: We observed good results during
the execution of most classifiers using the training and validation
sets, with the best result being the logistic regression algorithm.
However, when classifying the test set, the performance was not
good, with the best results being the linear discriminant analysis.
We obtained a vocabulary related to instability with words associ-
ated with asynchronous behavior (then, await, return) and related
to UI (layout, gd, plot, click). Conclusions: This work presents
relevant results toward a more efficient identification of flaky tests
in projects that use Javascript. Further studies are required to con-
solidate a reliable classification of tests regarding flakiness using
the vocabulary approach.*


# Table of contents

## Flaky Tests Tokenization Features

- [Get Test Code from Repositories](#Tokenizer)
- [Select and Parse all CUT (Code Under Test)](#dependencies)

# Tokenizer

## Setup Repositories

```
cd configs
```

- Add repository author and name with format (author/name) on line into repositories.txt
  - Example: 
    ``` 
    angular/angular
    angular/components
    ```

- Add repositories tests paths and names on `availables-tests-folders.txt` and `availables-test-names.txt` 
  - Example:
    - `availables-tests-folders.txt`
    ``` 
    test
    spec
    __tests__
    tests
    integration
    e2e-tests
    integration-tests
    js/tests
    ```
    
    - `availables-test-names.txt`
    ``` 
    test
    it
    ```

## Run tokenizer

```
cd src/
yarn
yarn run:tokenizer
```


# Authors

<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/38047989?v=4" width="100px;" alt=""/></a><br /><a href="https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/" title="Rafael Soratto"><img href="https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/" src="https://img.shields.io/badge/-RafaelSoratto-0077B5?style=flat&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/"></a></td>
  </tr>
</table>
