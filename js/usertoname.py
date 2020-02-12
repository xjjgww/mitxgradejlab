from requests_html import HTMLSession
from bs4 import BeautifulSoup
import re
import json

session = HTMLSession()

htmls = ["name-table-814.html", "name-table-813.html"]
names = {}

for filename in htmls:
    html = open(filename, "r").read()
    parsed_html = BeautifulSoup(html, "html.parser")
    trs = parsed_html.find_all('a')

    for user in trs:
        kerberos = user.text
        url = "https://web.mit.edu/bin/cgicso?options=general&query=" + kerberos
        r = session.get(url)
        sel = 'body > #contents > #main > table > tr > td > table > tr > td > pre'
        prename = list(r.html.find(sel))[0]
        print(kerberos+" -- "+prename.text)
        parsename = re.search(r'name:\s(.+?)\semail.+', prename.text)
        if parsename == None: continue
        name = parsename[1]
        names[kerberos] = name
        print(kerberos+' ... '+name)

print(names)

with open('namelist.js', 'w') as outfile:
    json.dump(names, outfile, indent=2)  
