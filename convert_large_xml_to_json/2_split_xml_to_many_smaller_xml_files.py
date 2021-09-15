path = "./../dblp.org/dblp.uni-trier.de/xml/release/"
# filename1 = "test5000_with_newlines"
filename2 = "dblp-2021-07-01_with_newlines"
ENDINGS = ["</article>", "</inproceedings>", "</proceedings>", "</book>", "</incollection>", "</phdthesis>", "</mastersthesis>", "</www>", "</person>", "</data>"]
FILE_CHOSEN = filename2
SPLIT_EVERY = 1000000
with open(path + FILE_CHOSEN + ".xml", "r") as f:
    small_xml = ""
    i = 0
    j = 0
    k = 1
    while True:
        line = f.readline()
        if not line: break
        print("Line", i, "block", k)
        if i > SPLIT_EVERY * k:
            ending_type = ""
            flag_ending = False
            for ending in ENDINGS:
                if ending in line:
                    ending_type = ending
                    flag_ending = True
            if flag_ending:
                # split write to small file clean small_xml reset j
                small_xml = small_xml + line
                writef = open(path + "/" + FILE_CHOSEN + "_blocks/" + FILE_CHOSEN + "_line=" + str(i) + "_block=" + str(k) + ".xml", "w")
                writef.write(small_xml)
                writef.close()
                k = k + 1
                small_xml = ""
                j = 0
            else:
                j = j + 1
                small_xml = small_xml + line
        else:
            small_xml = small_xml + line
        i = i + 1
    writef = open(path + "/" + FILE_CHOSEN + "_blocks/" + FILE_CHOSEN + "_line=" + str(i) + "_block=" + str(k) + "_last.xml", "w")
    writef.write(small_xml)
    writef.close()
