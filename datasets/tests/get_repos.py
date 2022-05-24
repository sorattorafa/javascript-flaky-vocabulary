
# Python program to read
# json file
  
  
import json
  
# Opening JSON file
f = open('./flaky-parsed.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)
  
# Iterating through the json
# list

repos = []
for i in data:
    project_git = i['project_author'] + '/' + i['project_name'] + '.git'
    if project_git not in repos:
        repos.append(project_git)

repos_dict = []
for repo in repos:
    repo_count = 0
    for i in data:
        if (i['project_author'] + '/' + i['project_name'] + '.git') == repo:
            repo_count += 1
    repos_dict.append({ 'repo': repo, 'count': repo_count})

total = 0
for r in repos_dict:
    total += r['count']

print(total)
# Closing file
f.close()