## Installation

```
npm install
npm run start

```

Then POST requests can be made against localhost:3000/email

## Technical Choices

I chose Javascript, node.js, and express since they're a great combination for 
setting up a thin web server for something small like this. Other languages do 
have similar frameworks -- I considered Ruby with Sinatra for end user code 
familiarity and Scala with Scalatra for my own code comfort. I decided to go 
with express as something in between, and also because js is much more 
performant than Ruby, if this were to be built with the purpose of scale.


