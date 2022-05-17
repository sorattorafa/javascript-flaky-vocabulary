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
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
from sklearn.metrics import roc_auc_score
from sklearn.metrics import matthews_corrcoef
from sklearn.metrics import plot_confusion_matrix
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

def initDataset(flakyFileName, normalFileName):
    
    df_flaky = pd.read_csv(flakyFileName)
    df_normal = pd.read_csv(normalFileName)
    

    df_flaky['is_flaky'] = True
    df_normal['is_flaky'] = False
    
    frames = [df_flaky, df_normal]
    
    result = pd.concat(frames)

    result = result.fillna(0)
    
    y = result['is_flaky']

    result.drop('is_flaky', axis=1, inplace=True)
    result.drop('id', axis=1, inplace=True)

    x = result
    
    X_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.20, random_state=1)
   
    return [X_train, x_test, y_train, y_test]

def initClassifiers():
    classifiers = {
        'randomForest': RandomForestClassifier(random_state=1), 
        'decisionTree': DecisionTreeClassifier(min_samples_leaf=1),
        'naiveBayes': GaussianNB(),
        'smo': CalibratedClassifierCV(LinearSVC(fit_intercept=False, tol=0.001, C=1, dual=False, max_iter=100000), method='sigmoid'),
        'knn': KNeighborsClassifier(n_neighbors=1, metric='euclidean'),
        'logisticRegression': LogisticRegression(max_iter=1000),
        'perceptron': CalibratedClassifierCV(Perceptron()),
        'lda': LinearDiscriminantAnalysis(),
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
        
    df[df.predictedclass != df.labeltestclass].to_csv("IC/" + classifier + "_IC.txt")

def execClassifiers(X_train, x_test, y_train, y_test, classifiers, normalize=[], plot=True):

    labels = ['Flaky', 'NonFlaky']
    results = pd.DataFrame()

    comparison_values = {}

    # create a normalized version
    trainScaler = Binarizer(threshold=0.0).fit(X_train)
    testScaler = Binarizer(threshold=0.0).fit(x_test)
    X_train_norm = trainScaler.transform(X_train)
    x_test_norm = testScaler.transform(x_test)

    for key, classifier in classifiers.items():

        x_train_exec = X_train
        x_test_exec = x_test
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
        
        saveIncorrectClassifications(x_test_exec, predict, y_test, key)

        result = {
            'classifier': key,
            'f1Score': f1_score(y_test, predict, average='weighted'), #labels=labels,
            'accuracy': classifier.score(x_test_exec, y_test),
            'confucionMatrix': confusion_matrix(y_test, predict),
            'execution': round_float(get_time(start_time)),
            'classificationReport': classification_report(y_test, predict, output_dict=True), #, target_names=labels
            'AUC': roc_auc_score(y_test, y_probs),
            'MCC': matthews_corrcoef(y_test, predict), 
        }

        results = results.append(result,  ignore_index=True)

        if (plot):
            plot_learning_curve(classifier, key, key, x_train_exec, y_train, ylim=(0.7, 1.01), n_jobs=4) #cv=cv, 

            comparison_values[key] = {
                'y_test': y_test,
                'y_probs': y_probs
            }

            disp = plot_confusion_matrix(classifier, x_test_exec, y_test,
                                 display_labels=['nonflaky', 'flaky'],
                                 cmap=plt.cm.Blues)
            disp.ax_.set_title(key)
            
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
    dirName = './datasets/dataframes/'
    flakyFileName = dirName + 'flaky-1.csv'
    normalFileName = dirName + 'normal-1.csv'

    X_train, x_test, y_train, y_test = initDataset(flakyFileName, normalFileName)
    print("Data - OK")

    classifiers = initClassifiers()
    print("Classifiers - OK")

    results = execClassifiers(X_train, x_test, y_train, y_test, classifiers, normalize=['knn'])
