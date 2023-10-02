from sklearn.feature_selection import mutual_info_classif
import pandas as pd
import re

def weka_tokenizer(doc):
    delimiters_regexp = re.compile("[ |\n|\f|\r|\t|.|,|;|:|'|\"|(|)|?|!]")
    # delimiters_regexp = re.compile("[ -\/:-@\[-\`{-~|0-9|\n|\f|\r|\t|\s]")
    return list(filter(None, delimiters_regexp.split(doc)))

if __name__ == '__main__':

    dirName = './datasets/dataframes'
    flakyFileName = dirName + '/flakies/1.csv'
    normalFileName = dirName + '/normal/1.csv'

    df_flaky = pd.read_csv(flakyFileName)
    df_normal = pd.read_csv(normalFileName)
    
    df_flaky['is_flaky'] = True
    df_normal['is_flaky'] = False
    
    frames = [df_flaky, df_normal]
    
    result = pd.concat(frames)
    
    result = result.fillna(0)

    result.drop('id', axis=1, inplace=True)

    y = result['is_flaky']
    
    df_data = result.copy()

    result.drop('is_flaky', axis=1, inplace=True)

    df = result

    informationGain = dict(zip(df.columns, mutual_info_classif(df, y, discrete_features=True)))

    sortedInformationGain = sorted(informationGain, key=informationGain.get, reverse=True)
    i = 0

    sortedInformationGainPosition = []

    for r in sortedInformationGain:    
     
        infGain = {
            'position': i, 
            'token': r, 
            'information_gain': informationGain[r], 
            'total_ocurences': len(df_data[df_data[r] > 0 ] ), 
            'total_flaky_occurences': len(df_data[ (df_data[r] > 0)  & (df_data['is_flaky'] == True) ]), 
            'total_nonflaky_occurences': len(df_data[ (df_data[r] > 0)  & (df_data['is_flaky'] == False) ])
        }
        sortedInformationGainPosition.append(infGain)
        i += 1
        print(i, r, informationGain[r])
        
    infGainCSV = pd.DataFrame(sortedInformationGainPosition, columns=['position', 'token', 'information_gain', 'total_ocurences', 'total_flaky_occurences', 'total_nonflaky_occurences'])
    infGainCSV.to_csv('./results_first_experiment/information_gain_rq_12.csv')