import classifier.classifier as CSO
import os
import json
import nltk
import spacy

OUTPUT_DIR = "./Data/preprocessed/"
INPUT_DIR = "./Data/output/"
RESULT_FILE = "result.json"


def main():
    file_names = os.listdir(INPUT_DIR)
    whole_data = dict()

    for file in file_names:
        with open(INPUT_DIR + file, encoding='utf-8') as json_file:
            try:
                data = json.load(json_file)
                whole_data[data['fileName']] = data
            except UnicodeDecodeError:
                print(file)

    result = CSO.run_cso_classifier_batch_mode(whole_data,
                                               workers=4,
                                               modules="semantic",
                                               enhancement="first")

    print(len(result))

    with open(OUTPUT_DIR + RESULT_FILE, 'w') as fp:
        json.dump(result, fp)

    return 0


if __name__ == "__main__":
    nltk.download('stopwords')
    spacy.load('en_core_web_sm')
    main()
