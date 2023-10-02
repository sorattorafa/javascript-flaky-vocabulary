<h1 align="center">Vocabulary of flaky tests in Javascript</h1>
<p href="#descricao" align="center">Get test tokens by Github repository url and training ML models to predict flakiness with Javascript test code.</p>

<div align="center">
  <img alt="Java" src="https://img.shields.io/badge/javascript-%23ED8B00.svg?style=for-the-badge&logo=javascript&logoColor=white"/>
</div>


# Vocabulary of flaky tests in Javascript

This repository contains supplementary material of the Thesis "Vocabulary of flaky tests in Javascript" as a parcial requisite to fullfill computer scientist course of Universidade Tecnológica Federal do Paraná, Campo Mourão. 

**Abstract**: 

*Context: Regression testing is a software verification and validation activity in modern software engineering. In this activity, tests can fail without any implementation change, characterizing a flaky test. Flaky tests may delay the release of the software and reduce testing confidence. One way to identify flaky tests is by re-running the tests, but this has a high computational cost. An alternative to re-execution is the static analysis of the code of the test cases, identifying patterns related to flaky tests. Objective: The objective of this work was to identify flaky tests in Javascript applications by analysing the source code of the test cases, without executing them. Method: A dataset was built with flaky test cases extracted from open source software hosted on Github that are implemented in Javascript. Then, a classification model and an flakiness vocabulary were created, considering the source code of flaky tests in the Javascript language. Results: We provide a dataset with the source code of flaky and non-flaky Javascript test cases, the output of machine learning models to predict flaky tests from source code, an flakiness vocabulary for test cases Javascript testing and artifacts to extract textual information from test cases on Github. Conclusions: This work presents relevant results for identifying flaky tests in projects that use Javascript. Flakiness vocabulary can speed identification of the root cause of intermittent failure. For example, in asynchronous waiting root cause we found that the terms ‘then’, ‘await’, ‘return’ and ‘done’ can be directly related to instability. Further studies are required to consolidate the reliable classification of tests regarding flakiness using the vocabulary approach.*




## Get data from Github section

<!--ts-->

- [Dependencies](#dependencies)
- [Executando o projeto](#run)
- [Exemplos de Uso](#use-cases)
- [Autores](#authors)
<!--te-->

# Dependencies

- Install dependencies

```shell
cd src
npm install
```

# Run

## 🎲 Generate csv with tokens by test

### Setup repositories

- All Configurations of code-tokenizer are saved into configs

### Run

```bash
# into src path execute
$ node src/test-code-tokenizer.js
```

# Use cases

- Can be used to extract test tokens by nodejs GitHub repositories.
- Can be to parse flaky tests from csv

#### Dependencies


### Repositórios analisados

Fora extraídos casos de testes destes repositórios para criar o dataset de tokens de testes.
uber/baseweb
angular/angular
angular/components
ploty/ploty_js
mobxjs/mobx
influxdata/influxdb
twbs/bootstrap

### RUN GITHUB COLLECT

- `node --max-old-space-size=18192 .\src\main.js`

# Authors

<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/38047989?v=4" width="100px;" alt=""/></a><br /><a href="https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/" title="Rafael Soratto"><img href="https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/" src="https://img.shields.io/badge/-RafaelSoratto-0077B5?style=flat&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/rafael-rampim-soratto-a42793190/"></a></td>
  </tr>
</table>
