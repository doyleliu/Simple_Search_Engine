import json
import heapq

PREPROCESSED_FILE = "./Data/preprocessed/result.json"
MAPPING_FILE = "./Data/preprocessed/mapping.json"
MAPPING_KEY = "enhanced"
TOP10_FILE = "./Data/preprocessed/top10.json"


def main():
    mapping = dict()
    top10_freq = list()
    heapq.heapify(top10_freq)
    with open(PREPROCESSED_FILE, encoding='utf-8') as json_file:
        result = json.load(json_file)

    for k in result:
        v = result[k]
        for key_phrase in v[MAPPING_KEY]:
            if key_phrase not in mapping:
                mapping[key_phrase] = [k]
            else:
                mapping[key_phrase].append(k)

    with open(MAPPING_FILE, 'w') as fp:
        json.dump(mapping, fp)

    for k in mapping:
        if len(top10_freq) < 10:
            heapq.heappush(top10_freq, (len(mapping[k]), k))
        else:
            if len(mapping[k]) > top10_freq[0][0]:
                heapq.heappop(top10_freq)
                heapq.heappush(top10_freq, (len(mapping[k]), k))

    top10_freq.sort(reverse=True)

    top10_material = dict()

    for k in top10_freq:
        print(k)
        top10_material[k[1]] = mapping[k[1]]

    with open(TOP10_FILE, 'w') as fp:
        json.dump(top10_material, fp)


if __name__ == "__main__":
    main()
