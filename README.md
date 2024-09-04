# jsfun
So the code is in JavaScript, but actually most of it is to help with Python programming. The main tool is a [Python Display tool](https://jamesabela.github.io/jsfun/pythoncopy), but there is also a
[Binary Conversion tool](https://jamesabela.github.io/jsfun/binaryconvertor.html), a [Diamond 9](https://jamesabela.github.io/jsfun/diamond9.html) which automates this set of [slides](https://docs.google.com/presentation/d/1FS-kOrCE4xuCCn4SM8Yt1Hm-81fIFxG5wzxbfamFArY/template/preview) and a simple [binary quiz](https://jamesabela.github.io/jsfun/binaryquiz.html) 

## Features

A [display tool](https://jamesabela.github.io/jsfun/pythoncopy) that will enable you to download Python files as either .py files or .txt files if your firewall is very restrictive.
It enables you to choose dark mode or light mode and it enables you to go full-screen. 

For code under 20 lines it will make a puzzle too! 

## How to use

![Raw file](https://i.imgur.com/TT0mVo8.png)

Click on [Python Code Display Tool](https://jamesabela.github.io/jsfun/pythoncopy) You can then add a url to raw gist file. such as: 
[https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/average.py](https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/average.py)

It will then update with the new url. To embed this into your own site, just add the final url that appears: 

e.g. [https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/average.py](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/average.py)

You can display nearly any Python file you choose, make a Parsons puzzle of the first 20 lines and get step by step display from [Pythontutor.com](https://pythontutor.com/python-compiler.html#mode=edit)

## Why download a text file?
Some school firewalls don't allow you to download .py files, because they are executables, so this ensures they are not.

## Advanced use
Use ?url= to add the site you want. It needs to be a raw Python file. 

Example:
https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/cf6a0c1725a3212dedd77657911f2a63/raw/964efc7fc9df266ebe5f2826d97fe719868dc62b/pi.py

For up to 20 lines you can use the reordering quiz. It uses the same format:
https://jamesabela.github.io/jsfun/reorder?url=https://gist.githubusercontent.com/jamesabela/ce1a69f05f78fa56fbd03a4f31d13978/raw/4ff44e44fae1192081ebed6f793fd34ae68c1d6d/grocer.py
Simply use ?url= and the url you want to display.

You should be able to use any file on github and probably other sites too. I've put some of the [common algorithms](https://gist.github.com/jamesabela/53cc928fd03720c0803839b31bcda287) for iGCSE below as a tester. 

## iGCSE Algorithms

* [Average](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/average.py)
* [Bubble](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/bubble)
* [Counting](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/Counting.py)
* [forloop](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/forloop.py)
* [ifelse](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/ifelse.py)
* [linear](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/linear.py)
* [Max and min](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/MaximumandMinimum.py)
* [repeat](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/repeat.py)
* [totalling](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/Totalling.py)
* [whileloop](https://jamesabela.github.io/jsfun/pythoncopy?url=https://gist.githubusercontent.com/jamesabela/53cc928fd03720c0803839b31bcda287/raw/635a2c7b12a1a6af75623d65d41889e8e1bbce96/whileloop.py)

## Known limitations
* Doesn't work with Pastebin
* You can only visualise up to 5600 bytes. (Python tutor limit)
* When embedded in Google Sites, doesn't allow full screen display (This is a limit on all web pages in sites).

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) James Abela
