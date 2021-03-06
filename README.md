

# Ricall.me
### Ricall is an intelligent personal assistant for people with neurodegenerative diseases as Alzheimer 

<p>
<img align="left" width="100" src="https://user-images.githubusercontent.com/17257576/28406075-d7e85100-6ce3-11e7-9717-79893659b847.png">
Ricall is an cool project to help people with neurodegenerative diseases to rimember things they often forget. With 3 friends we created an MVP of the project in two weeks at <a href="https://www.42.us.org/"> 42 Silicon Valley</a>. There is three main aspects in what we have built: the VUI, the Ricall manager and the webapp. </p>


*This project needed to respect a certain number of constraints that justify certain "complex" choices we made to develop the MVP. There is several libraries more powerfull and efficient but the pedagogic aspect was to learn to implement this in C from scratch only using CMU sphinx*

### The VUI (voice-user interface)
<img align="right" width="200" src="https://media.giphy.com/media/v1PSPwbLIrata/giphy.gif">

So what's the VUI? 
> A voice-user interface (VUI) makes human interaction with computers possible through a voice/speech platform in order to initiate an automated service or process.

We created our Ricall VUI using CMU Sphinx an open source voice recoginition library in C that help you to train a model to recoginse a certain number of phrases thanks to a dictionary of words you create. 


### The Ricall manager
<img align="right" width="200" src="https://media.giphy.com/media/3o6ozD4FXYQNv5ERjy/giphy-downsized.gif">

Then we created a ricall manager also in C that takes a json file with a certain number of events and optimizes its internal database to be able to retrive the correct information to the user given the day of the week, the hour of the day and other variables we set. Basically it figures out when a certain ricall should be pronounced.

### The web application


We developed an MVP of the web application in less than a week using NodeJS, MangoDB and EJS templeting that you can run on your local machine.

The most challenging part of the project was to interact with Google APIs for the Authentification and for the calendar management. 

* Install

Download/clone this repo:

	git clone https://github.com/tonoli/Ricall.me
	
Get into it and build:
	
	cd webapp
	npm install && node app.js
  

You can now open and try it
  
  http://localhost:3000 
  

<img alt="ricall.me" title="ricall.me webapp" src="https://pbs.twimg.com/media/DCvP9GCVYAAt9P3.jpg:medium">
