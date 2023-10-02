import pandas as pd
import pickle
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import Perceptron
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import f1_score
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from sklearn.metrics import classification_report
from sklearn.metrics import roc_auc_score
from sklearn.metrics import matthews_corrcoef
#from sklearn.metrics import plot_confusion_matrix
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import Binarizer
from sklearn.calibration import calibration_curve
import time
import re
from sklearn.model_selection import learning_curve
import numpy as np
#from xgboost import XGBClassifier
from sklearn.feature_extraction.text import CountVectorizer

def initDataset(flakyFileName, nonFlakyFileName, newFlakyFileName, unknownFileName):
    # read 4 csv's
    df_tcc_flaky = pd.read_csv(flakyFileName)
    df_tcc_unknown = pd.read_csv(unknownFileName)
    
    df_new_normal = pd.read_csv(nonFlakyFileName)
    df_new_flakies = pd.read_csv(newFlakyFileName)    

    # add is_flaky column label
    df_tcc_flaky['is_flaky'] = True
    df_tcc_unknown['is_flaky'] = False
    
    df_new_normal['is_flaky'] = False
    df_new_flakies['is_flaky'] = True
    
    # get x and y to training model
    x, y = get_x_and_y_from_dfs(df_tcc_flaky, df_tcc_unknown)

    # get x and y to test model 
    new_x_test, new_y_test = get_x_and_y_from_dfs(df_new_flakies, df_new_normal)
        
    # add missing columns to original df and new df
    x = add_missing_columns(x, new_x_test)
    new_x_test = add_missing_columns(new_x_test, x)

    # set df columns the same order
    x, new_x_test = order_df_columns(x, new_x_test)
    
    # remove not a numbers
    x = x.fillna(0)
    new_x_test = new_x_test.fillna(0)

    # get training instances
    #X_train, _, y_train, _ = train_test_split(x, y, test_size=0.20, random_state=1)

    # return training and test instances
    return [x, new_x_test, y, new_y_test]

def get_x_and_y_from_dfs(df_flaky, df_normal):
    frames = [df_flaky, df_normal]
    result = pd.concat(frames)
    y = result['is_flaky']
    result.drop('is_flaky', axis=1, inplace=True)
    x = result
    return [x, y]

def order_df_columns(x, y):
    desired_order = x.columns
    y = y.reindex(columns=desired_order)
    x = x.reindex(columns=desired_order)
    
    return [x, y]
    
def add_missing_columns(df, df_w_columns):
    missing_columns = [column_name for column_name in df_w_columns.columns if column_name not in df.columns]
    missing_columns_df = pd.DataFrame(0, index=df.index, columns=missing_columns)
    df = pd.concat([df, missing_columns_df], axis=1)
    return df

def initClassifiers():
    classifiers = {
        #'lda': LinearDiscriminantAnalysis(),
        'randomForest': RandomForestClassifier(random_state=1), 
        'decisionTree': DecisionTreeClassifier(min_samples_leaf=1),
        'naiveBayes': GaussianNB(),
        'smo': CalibratedClassifierCV(LinearSVC(fit_intercept=False, tol=0.001, C=1, dual=False, max_iter=100000), method='sigmoid'),
        'knn': KNeighborsClassifier(n_neighbors=1, metric='euclidean'),
        'logisticRegression': LogisticRegression(max_iter=1000),
        'perceptron': CalibratedClassifierCV(Perceptron()),
        #'xgb': XGBClassifier(),
    }

    return classifiers

def round_float(value):
    return float("{:.3f}".format(value))

def get_time(start_time):
    end_time = time.time()
    return end_time - start_time

def weka_tokenizer(doc):
    delimiters_regexp = re.compile("[ |\n|\f|\r|\t|.|,|;|:|'|\"|(|)|?|!]")
    return list(filter(None, delimiters_regexp.split(doc)))

def plot_learning_curve(estimator, name, title, X, y, axes=None, ylim=None, cv=None,
                        n_jobs=None, train_sizes=np.linspace(.1, 1.0, 5)):

    if axes is None:
        fig, axes = plt.subplots(1, 3, figsize=(30, 7))

    axes[0].set_title(title)

    if ylim is not None:
        axes[0].set_ylim(*ylim)

    axes[0].set_xlabel("Training examples")
    axes[0].set_ylabel("Score")

    train_sizes, train_scores, test_scores, fit_times, _ = \
        learning_curve(estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes, return_times=True)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    test_scores_std = np.std(test_scores, axis=1)
    fit_times_mean = np.mean(fit_times, axis=1)
    fit_times_std = np.std(fit_times, axis=1)

    # Plot learning curve
    axes[0].grid()
    axes[0].fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1, color="r")
    axes[0].fill_between(train_sizes, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1, color="g")
    axes[0].plot(train_sizes, train_scores_mean, 'o-', color="r", label="Training score")
    axes[0].plot(train_sizes, test_scores_mean, 'o-', color="g", label="Cross-validation score")
    axes[0].legend(loc="best")

    # Plot n_samples vs fit_times
    axes[1].grid()
    axes[1].plot(train_sizes, fit_times_mean, 'o-')
    axes[1].fill_between(train_sizes, fit_times_mean - fit_times_std, fit_times_mean + fit_times_std, alpha=0.1)
    axes[1].set_xlabel("Training examples")
    axes[1].set_ylabel("fit_times")
    axes[1].set_title("Scalability of the model")

    # Plot fit_time vs score
    axes[2].grid()
    axes[2].plot(fit_times_mean, test_scores_mean, 'o-')
    axes[2].fill_between(fit_times_mean, test_scores_mean - test_scores_std, test_scores_mean + test_scores_std, alpha=0.1)
    axes[2].set_xlabel("fit_times")
    axes[2].set_ylabel("Score")
    axes[2].set_title("Performance of the model")

    fig.savefig('plot/' + name + '.png')

def plot_comparison(comparison_values):
    
    comp = plt.figure(figsize=(10, 10))
    ax1 = plt.subplot2grid((3, 1), (0, 0), rowspan=2)
    ax2 = plt.subplot2grid((3, 1), (2, 0))

    for key, classifier in comparison_values.items():
        fraction_of_positives, mean_predicted_value = calibration_curve(classifier['y_test'], classifier['y_probs'], n_bins=10)
        ax1.plot(mean_predicted_value, fraction_of_positives, "s-",label="%s" % (key))
        ax2.hist(classifier['y_probs'], range=(0, 1), bins=10, label=key, histtype="step", lw=2)

    ax1.set_ylabel("Fraction of positives")
    ax1.set_ylim([-0.05, 1.05])
    ax1.legend(loc="lower right")
    ax1.set_title('Calibration plots  (reliability curve)')        

    ax2.set_xlabel("Mean predicted value")
    ax2.set_ylabel("Count")
    ax2.legend(loc="upper center", ncol=2)

    comp.tight_layout()

    comp.savefig('plot/compare.png')


def saveIncorrectClassifications(X_test, predicted, label, classifier):

    label = label.to_frame(name='labeltestclass').reset_index()
    predicted = pd.DataFrame(predicted, columns=['predictedclass']).reset_index()

    df = pd.DataFrame(X_test).reset_index()
    df["labeltestclass"] = label.reset_index()["labeltestclass"]
    df["predictedclass"] = predicted.reset_index()["predictedclass"]
        
    errors = df[df.predictedclass != df.labeltestclass]
    
    id_errors = []

    for index, row in errors.iterrows():
       if ('id' in row.keys()):
            id_errors.append({'id': row['id']})
            
    incorrect_data = pd.DataFrame(id_errors, columns=['id'])
    incorrect_names = "IC/ids/" + classifier + "_IC.csv"
    incorrect_data.to_csv(incorrect_names)
    
    errors.to_csv("IC/" + classifier + "_IC.txt")

def execClassifiers(X_train, x_test, y_train, y_test, classifiers, normalize=[], plot=True):

    labels = ['Flaky', 'NonFlaky']
    results = pd.DataFrame()

    comparison_values = {}

    data_X_train = X_train.copy()
    data_x_test = x_test.copy()

    data_X_train =  data_X_train.loc[:, data_X_train.columns != 'id']
    data_x_test =  data_x_test.loc[:, data_x_test.columns != 'id']
    
    
    # create a normalized version
    trainScaler = Binarizer(threshold=0.0).fit(data_X_train)
    X_train_norm = trainScaler.transform(data_X_train)

    testScaler = Binarizer(threshold=0.0).fit(data_x_test)
    x_test_norm = testScaler.transform(data_x_test)

    for key, classifier in classifiers.items():

        x_train_exec = data_X_train
        x_test_exec = data_x_test
        y_train_exec = y_train
        y_test_exec = y_test

        if (key in normalize):
            x_train_exec = X_train_norm
            x_test_exec = x_test_norm

        classifier.fit(x_train_exec, y_train)
        
        classifier.score(x_test_exec, y_test)

        predict = classifier.predict(x_test_exec)

        #print(classifier.predict_proba(x_test_exec)[:1])

        y_probs = classifier.predict_proba(x_test_exec)[:,1]
        
        saveIncorrectClassifications(x_test, predict, y_test, key)

        cm = confusion_matrix(y_test, predict)
        
        result = {
            'classifier': key,
            'f1Score': f1_score(y_test, predict, average='weighted'), #labels=labels,
            'accuracy': classifier.score(x_test_exec, y_test),
            'confucionMatrix': cm,
            'execution': round_float(get_time(start_time)),
            'classificationReport': classification_report(y_test, predict, output_dict=True), #, target_names=labels
            'AUC': roc_auc_score(y_test, y_probs),
            'MCC': matthews_corrcoef(y_test, predict), 
        }

        results = results._append(result,  ignore_index=True)

        if (plot):
            plot_learning_curve(classifier, key, key, x_train_exec, y_train, ylim=(0.7, 1.01), n_jobs=4) #cv=cv, 

            comparison_values[key] = {
                'y_test': y_test,
                'y_probs': y_probs
            }

            disp = ConfusionMatrixDisplay(cm, display_labels=['nonflaky', 'flaky'])
            disp.plot()
            #disp.ax_.set_title(key)
            
            plt.savefig('plot/CM/cm_' + key + '.png')

        
        #pickle.dump(classifier, open("classifiers/" + key + ".sav", 'wb'))
                        
        print(key, classification_report(y_test, predict, output_dict=True), matthews_corrcoef(y_test, predict), roc_auc_score(y_test, y_probs), "\n \n")   

    if (plot):
        plot_comparison(comparison_values)
    results.to_csv('results/results.csv',index=False)
    return results


def get_time(start_time):
    end_time = time.time()
    return end_time - start_time

if __name__ == "__main__":
    # verificar para todos projetos
    start_time = 0
    dirName = './datasets/dataframes'
    
    flakyFileName = dirName + '/flakies/1.csv'
    unknownFileName = dirName + '/normal/1.csv'
    
    nonFlakyFileName = dirName + '/normal/2.csv'
    newFlakyFileName = dirName + '/flakies/2.csv'

    X_train, x_test, y_train, y_test = initDataset(flakyFileName, nonFlakyFileName, newFlakyFileName, unknownFileName)
    print("Data - OK")

    classifiers = initClassifiers()
    print("Classifiers - OK")

    results = execClassifiers(X_train, x_test, y_train, y_test, classifiers, normalize=['knn'])
