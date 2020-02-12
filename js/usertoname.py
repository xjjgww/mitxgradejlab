from requests_html import HTMLSession
from bs4 import BeautifulSoup
import re
import json

session = HTMLSession()

html = open("name-table.html", "r").read()
parsed_html = BeautifulSoup(html, "html.parser")
trs = parsed_html.find_all('a')

names = {}
for user in trs:
    kerberos = user.text
    print(kerberos+' ...')
    url = "https://web.mit.edu/bin/cgicso?options=general&query=" + kerberos
    r = session.get(url)
    sel = 'body > #contents > #main > table > tr > td > table > tr > td > pre'
    prename = list(r.html.find(sel))[0]
    name = (re.search(r'name:\s(.+?)\semail.+', prename.text))[1]
    names[kerberos] = name

print(names)

with open('namelist.js', 'w') as outfile:
    json.dump(names, outfile, indent=2)  
