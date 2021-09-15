import os
import json
import xmltodict as xmltodict
# path1 = "./../dblp.org/dblp.uni-trier.de/xml/release/test5000_with_newlines_blocks"
path2 = "./../dblp.org/dblp.uni-trier.de/xml/release/dblp-2021-07-01_with_newlines_blocks"
# path3 = "./../dblp.org/dblp.uni-trier.de/xml/release/test"
ENDINGS = ["</article>", "</inproceedings>", "</proceedings>", "</book>", "</incollection>", "</phdthesis>", "</mastersthesis>", "</www>", "</person>", "</data>"]
chosen_path = path2
for file in os.listdir(chosen_path):
    print(file)
    if not os.path.exists(chosen_path + "_json/" + file + ".json"):
        writef = open(os.path.join(chosen_path + "_json/", file) + ".json", "a")
        with open(os.path.join(chosen_path, file), "r", encoding='utf-8') as f:
            small_xml = ""
            while True:
                line = f.readline()
                if not line:
                    break
                elif line == "\n" or "<?xml version=" in line or "<dblp>" in line or "</dblp>" in line or "<!DOCTYPE dblp" in line:
                    continue
                if "&" in line:
                    line = line.replace("&", "&#38;")
                ending_type = ""
                flag_ending = False
                for ending in ENDINGS:
                    if ending in line:
                        ending_type = ending
                        flag_ending = True
                if flag_ending:
                    # split write to small file clean small_xml reset j
                    small_xml = small_xml + line
                    # print(small_xml)
                    obj = xmltodict.parse(small_xml)
                    # print(obj)
                    jsonobj = json.dumps(obj)
                    # print(jsonobj)
                    writef.write(jsonobj)
                    writef.write("\n")
                    small_xml = ""
                else:
                    small_xml = small_xml + line
            if small_xml and small_xml != "" and small_xml != "\n":
                obj = xmltodict.parse(small_xml)
                jsonobj = json.dumps(obj)
                writef.write(jsonobj)
        writef.close()
        f.close()
