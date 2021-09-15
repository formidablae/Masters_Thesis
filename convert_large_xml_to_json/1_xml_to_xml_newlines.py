path = "./../dblp.org/dblp.uni-trier.de/xml/release/"
# filename1 = "release/test"
# filename2 = "test5000"
filename3 = "dblp-2021-07-01"
ENDINGS = ["</article>", "</inproceedings>", "</proceedings>", "</book>", "</incollection>", "</phdthesis>", "</mastersthesis>", "</www>", "</person>", "</data>"]
FILE_CHOSEN = filename3
with open(path + FILE_CHOSEN + ".xml", "r") as f:
    small_xml = ""
    i = 0
    while True:
        line = f.readline()
        print("Line", i)
        if not line: break
        flag_ending = False
        ending_type = ""
        for ending in ENDINGS:
            if ending in line:
                ending_type = ending
                flag_ending = True
        if flag_ending:
            # split write to small file clean small_xml reset j
            line = line.replace(ending_type, ending_type + "\n\n")
            small_xml = small_xml + line
        else:
            small_xml = small_xml + line
        i = i + 1
    writef = open(path + FILE_CHOSEN + "_with_newlines.xml", "w")
    writef.write(small_xml)
    writef.close()
