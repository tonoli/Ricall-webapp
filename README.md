# Ricall.me
## Ricall is an intelligent personal assistant for people with neurodegenerative diseases as Alzheimer 

Ricall is an cool project to help people with neurodegenerative diseases to rimember things they often forget. With 3 friends we created an MVP of the project in two weeks. There is three main aspects in what we have built: the VUI, the Ricall manager and the webapp.

### The VUI (voice-user interface)
<p align="center"> <img src="https://media.giphy.com/media/v1PSPwbLIrata/giphy.gif"> </p>

So what's the VUI? 
> A voice-user interface (VUI) makes human interaction with computers possible through a voice/speech platform in order to initiate an automated service or process.

We created our Ricall VUI using CMU Sphynx an open source voice recoginition library in C that help you to train a model to recoginse a certain number of phrases thanks to a dictionary of words you create. 


### The Ricall manager

Then we created a ricall manager also in C that takes a json file with a certain number of events and optimizes its internal database to be able to retrive the correct information to the user given the day of the week, the hour of the day and other variables we set. Basically it figures out when a certain ricall should be pronounced.

### The web application

www.ricall.me

For the moment the website is a simple static comming soon page. But I developed an Alpha version of the Node JS web application in less than a week that you can run.

* Install

Download/clone this repo:

	git clone https://github.com/tonoli/Ricall.me
	
Get into it and build:
	
	cd webapp
	npm install && node app.js
  

You can now open and try it
  
  http://localhost:3000 
  

<img alt="ricall.me" title="ricall.me webapp" src="https://pbs.twimg.com/media/DCvP9GCVYAAt9P3.jpg:medium">
