import io
import json
import orjson
import pandas as pd
import numpy as np
import random
from dateutil.parser import parse
from matplotlib.colors import is_color_like

import platform
import sys
import gc

def print_memory_status():
    (gen1_threshold, gen2_threshold, gen3_threshold) = gc.get_threshold()
    (gen1_count, gen2_count, gen3_count) = gc.get_count()
    print("Memory statistics (current/threshold):", end=" ")
    print("1st(", gen1_count, gen1_threshold, ")", end=" ")
    print("2nd(", gen2_count, gen2_threshold, ")", end=" ")
    print("3rd(", gen3_count, gen3_threshold, ")")

# DONE (P0): contar repeticao dos tokens em um flaky {value, type, quantity}
# DONE (P0): Criar a tabela: linhas (testes) e colunas todos os tokens (de todos testes);

# TODO: 3 DATASETS: 
    # DONE: - APENAS OS TOKENS
    # DONE: - APENAS OS TOKENS + TIPOS
        # TODO (P1): verificar a abordagem de ignorar o tipo do token ou concatenar ele com o valor do token
    # - APENAS OS TOKENS CONFORME O SIGNIFICADO (e.g. string, url, aplicar regex)
        # TODO (P1): verificar separadamente se vale a pena unir tokens de mesmo tipo (e.g. numérico, string, url, etc) 
            # tipos de strings : tamanho de uma tela em pixel, cores, arquivo, diretorio, formatacao, marcadores html,

def is_date(string, fuzzy=False):
    """
    Return whether the string can be interpreted as a date.

    :param string: str, string to check for date
    :param fuzzy: bool, ignore unknown tokens in string if True
    """
    try: 
        parse(string, fuzzy=fuzzy)
        return True

    except ValueError:
        return False

def init_dataset(file_loc, sampling=False):
    gc.collect()
    with open(file_loc, encoding='utf8') as json_file:
        print("Counting tokens from", file_loc, flush = True)
        # data = json.load(json_file) # Opening JSON file
        data = orjson.loads(json_file.read())

        dataset_tokens = set()
        dataset_tokens.add('id')
        for row in data: # descobre todos os tokens do conjunto de dados
            for token in row['tokens']:
                dataset_tokens.add(token['value'])
        dataset_tokens = sorted(dataset_tokens)
        print("Found", len(dataset_tokens), "tokens", flush = True)

        print("Creating empty dataframe...", flush = True)
        dataset_df = pd.DataFrame(columns = dataset_tokens, dtype=np.int16).astype(np.int16)

        print("Processing test cases...", flush = True)
        i = 0
        for row in data:
            if sampling:
                if random.randint(1, 10) == 1:
                    print(".", end="", flush = True)
                else:
                    print("|", end="", flush = True)
                    continue
            else:
                print(".", end="", flush = True)
            instance_tokens = dict()
            # for dataset_token in dataset_tokens:
            #    instance_tokens[dataset_token] = 0
            for instance_token in row['tokens']:
                if instance_token['value'] not in instance_tokens:
                    instance_tokens[instance_token['value']] = 0
                else:
                    instance_tokens[instance_token['value']] = instance_tokens[instance_token['value']] + 1
            pd_row = pd.DataFrame.from_dict([instance_tokens]).astype(np.int16)
            pd_row['id'] = row['URL'] + '_' + str(row['start_line'])
            dataset_df = dataset_df._append(pd_row)
            i += 1
            if (i % 100 == 0):
                gc.collect()
                print(i)
        print("Done with", i, "instances", flush = True)
       
        print("Converting NaN to zero", flush = True)
        dataset_df.fillna(value=0, inplace=True)

        print("Converting datatype to int16", flush = True)
        
        original_df = dataset_df.copy()
        original_df =  original_df.loc[:, original_df.columns != 'id'].astype(np.int16, copy=False)
        original_df['id'] = dataset_df.loc[:, dataset_df.columns == 'id']
        dataset_df = original_df

        string_file = io.StringIO()
        dataset_df.info(buf = string_file, verbose=False, memory_usage = "deep", show_counts=True)    
        print("Memory usage for dataframe\n", string_file.getvalue())
        # memory_usage = dataset_df.memory_usage(index = True, deep = True)
        # print("Memory usage per column type\n", memory_usage.to_string())
        print("Done", flush = True)
        return dataset_df

def init_dataset_with_token_and_type(file_loc):    
    flaky_dataset_value_and_type = {}
    with open(file_loc, encoding='utf8') as json_file:
        data = json.load(json_file) # Opening JSON file

        for row in data: # agrupando tokens iguais
            for token in row['tokens']:
                token['quantity'] = row['tokens'].count(token)
            unique_list = pd.DataFrame(row['tokens']).drop_duplicates().to_dict('records')
            row['tokens'] = unique_list

        for row in data:    
            for token in row['tokens']:
                flaky_dataset_value_and_type[str(token['value'] + '_' + token['type'])] = []

        df_token_and_type = pd.DataFrame(flaky_dataset_value_and_type)  # construção de colunas e linhas
        flakies_value_and_type = [] # get  flakies with type dataset

        for row in data:    
            flaky_value_and_type = flaky_line(df_token_and_type, row, 'value_and_type')
            flakies_value_and_type.append(flaky_value_and_type)
        
        df_token_and_type = pd.DataFrame(flakies_value_and_type)
        return df_token_and_type

def get_string_value(token):
    fonts = ["'Roboto'", "'Arial'", "'Times New Roman'", "'Courier New'", "'Comic Sans MS'", "'Impact'", "'Georgia'", "'Palatino'", "'Helvetica'", "'Trebuchet MS'", "'Verdana'"]
    if('%' in token['value'].replace("'", '')):
        token_value = 'Percentage'
    elif(token['value'].replace("'", '') in ['x', 'y', 'z']):
        token_value = 'Coordinate'
    elif("'rgb(" in token['value']):
        token_value = 'Color'
    elif(is_color_like(token['value'].replace("'", ''))):
        token_value = 'Color'
    elif(token['value'] in fonts):
        token_value = 'Font'
    elif("'./" in token['value']):
        token_value = 'LocalPath'
    elif("'/" in token['value']):
        token_value = 'Path'
    elif("px'" in token['value']):
        token_value = 'Size Measure'
    elif(token['value'].replace("'", '') in ["rigth", "left", "top", "bottom", "center"]):
        token_value = 'Direction' 
    # verificar url web http, https, ftp...
    # is url method
    elif(token['type'] == 'String' and 'http' in token['value'].replace("'", '')):
        token_value = 'URL'
    elif(token['type'] == 'String' and '/api/' in token['value'].replace("'", '')):
        token_value = 'URL'
    else:
        return token['value']
    return token_value

def get_token_clustered_value(token):
    # este agrupamento é ajustado para um contexto web
    # isto pode gerar um overfiting para o dominio web
    # argumento: esses termos sao dinamicos em diferentes contextos
    if(token['type'] == 'Identifier'):
        token['value'] = token['value']
    elif(token['type'] == 'Numeric'):
        token['value'] = token['type']
    elif(is_date(token['value'].replace("'", ''))):
        token['value'] = 'Date'       
    if(token['type'] == 'String'):
        token['value'] = get_string_value(token)
    return token['value']
                       
def clustered_dataset(file_loc):
    """
    receives json file and returns flaky clustered dataframes
    """
    clustered_dataset = {}
    with open(file_loc, encoding='utf8') as json_file:
        data = json.load(json_file) # Opening JSON file
        for row in data: # agrupando tokens iguais de acordo com o contexto
            for token in row['tokens']:
                token['value'] = get_token_clustered_value(token)
           
        for row in data: # agrupando tokens iguais
            for token in row['tokens']:        
                token['quantity'] = row['tokens'].count(token)
            unique_list = pd.DataFrame(row['tokens']).drop_duplicates().to_dict('records')
            row['tokens'] = unique_list

        for row in data:    
            for token in row['tokens']:
                clustered_dataset[str(token['value'])] = []
      
        df = pd.DataFrame(clustered_dataset)
        flakies = [] # get  flakies dataset
        
        for row in data:
            flaky = flaky_line(df, row, 'value')
            flakies.append(flaky)
            
        df = pd.DataFrame(flakies)
        return df

if __name__ == "__main__":
  
    # flaky tests tcc
    flaky_tests_json = './datasets/tests/flaky-parsed-tcc.json'
    df = init_dataset(flaky_tests_json)
    df.to_csv('./datasets/dataframes/flakies/1.csv', index=False)
  
    # Normal datasets tcc
    #normal_tests_json = './datasets/tests/normal-tests-tcc.json'
    #normal_df = init_dataset(normal_tests_json, sampling=True)
    #normal_df.to_csv('./datasets/dataframes/normal/1.csv', index=False)
   
    # Flaky datasets
    flaky_tests_json = './datasets/tests/newflakies.json'
    df = init_dataset(flaky_tests_json)
    df.to_csv('./datasets/dataframes/flakies/2.csv', index=False)
    
    # Normal datasets
    normal_tests_json = './datasets/tests/normal-tests.json'
    normal_df = init_dataset(normal_tests_json)
    normal_df.to_csv('./datasets/dataframes/normal/2.csv', index=False)
   
   

   
    #TODO: atualizar initdataset para considerar esses elementos

    #df_token_and_type = get_token_w_type_dataset(flaky_tests_json)
    #df_token_and_type.to_csv('./datasets/dataframes/flakies/2.csv', index=False)
    #clustered_df = clustered_dataset(flaky_tests_json)
    #clustered_df.to_csv('./datasets/dataframes/flakies/3.csv', index=False)
    #normal_df_token_and_type = init_dataset_with_token_and_type(normal_tests_json)
    #normal_df_token_and_type.to_csv('./datasets/dataframes/normal/2.csv', index=False)
    #normal_clustered_df = clustered_dataset(normal_tests_json)
    #normal_clustered_df.to_csv('./datasets/dataframes/normal/3.csv', index=False)
