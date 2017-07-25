## Installation

To keep the API keys secret, set them as environment variables:
```
export MAILGUN_API_KEY=<mailgun api key>
export SENDGRID_API_KEY=<sendgrid api key>
```

For Mailgun you'll also have to modify the url in `config/default.json` to one 
that's sandboxed to your recipient email, or I can add you to my verified emails 
list.


To set up the server:
```
npm install
npm start
```

Then POST requests can be made against `localhost:3000/email`!

Mailgun is used by default. If we want to switch over to Sendgrid, simply change 
`"emailClient": "mailgun"` to `"emailClient": "sendgrid"` in the config.

## Technical Choices

I chose Javascript, node.js, and express since they're a great combination for 
setting up a thin web server for something small like this. Other languages do 
have similar frameworks -- I considered Ruby with Sinatra for end user (your) 
code familiarity and Scala with Scalatra for my own code comfort. I decided to 
go with express as something in between -- probably easier to grok than Scala if 
you're unfamiliar with it, and I have more recent experience with Javascript 
than Ruby. Also Javascript is significantly more performant than Ruby at scale, 
if this were to be built for such.

Other libraries I used were small node modules to make request and config 
handling easier.

One other small trade off I considered was having the EmailClient classes have a 
common sendEmail method that does the actual requesting to reduce code repeat, 
and then create an interface for another method that just defines the options to 
pass into the request. This would also have the advantage of making the options 
for MailgunClient and SendgridClient testable. However, it'd mean TestClient
would also have to make a request, and that'd complicate that part of the 
testing. Testing the options for the other clients also didn't seem that 
necessary since a test of the clients themselves clearly reveals when the 
options aren't correctly set.

## Other Considerations

With more time I'd make the TestClient actually mock send the email, perhaps to 
an in memory inbox that my test can then read to confirm my email looks as 
expected.

I'd also consider further how to make the body HTML conversion smarter -- right 
now it strips out the tags and adds newlines after every tag, making the 
assumption the tags are headers and divs and such, which you'd want to newline.

Additional smartness we could do is for tags like span, we can space instead of 
newline. Or remove the last newline if it's at the end of a block of content.
But for these, I'd want to consider it further if there are corner cases that 
it'd be bad for. Even the current conversion could produce unwanted behavior if 
there's brackets in the normal text, but that seems like an unlikely occurrence.

If this were a real email service I was building, I'd make the email API itself 
more robust to be able to share templates between emails. There would likely be 
another layer on top to send different kinds of emails, all calling this service 
for the actual sending.

For a real production service, I'd also use Typescript or Flux instead of 
standard Javascript to make the code strongly typed. Javascript's lack of type 
declaration / actual interfaces meant I had to declare client as an empty object 
first, with no indication it should be an EmailClient. That could be very 
confusing / brittle in production.
