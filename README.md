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
`"emailClient": "mailgun"` to `"emailClient": "sendgrid"` in the config, then 
restart the server.

To run the tests, which send emails with both clients:
```
npm test
```

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

## Other Considerations

I'd also consider further how to make the body HTML conversion smarter -- right 
now it strips out the tags and adds newlines after every tag, making the 
assumption the tags are headers and divs and such, which you'd want to newline.

Additional smartness we could do is for tags like span, we can space instead of 
newline. Or remove the last newline if it's at the end of a block of content.
But for these, I'd want to consider it further if there are corner cases that 
it'd be bad for. Even the current conversion could produce unwanted behavior if 
there's brackets in the plain text, but that seems like an unlikely occurrence.

If this were a real email service I was building, I'd make the email API itself 
more robust to be able to share templates between emails, as well as be able to 
batch send emails. There would likely be another layer on top to send different 
kinds of emails, all calling this service for the actual sending.

For a real production service, I'd also use Typescript or Flux instead of 
standard Javascript to make the code strongly typed. Javascript's lack of type 
declaration / actual interfaces makes the EmailClient interface brittle.

Also I would have set up a TestClient instead in the EmailController test. It'd 
store the emails sent in memory to check the contents of it, and then separately 
have unit tests to make sure the MailgunClient and SendgridClient are functional 
-- it's fairly easy to confirm mkOptions returns the configurations as the APIs 
expect. My current integration tests achieve both / lets me see the actual 
emails sent, which is nice for this exercise, but not as nice for continuous 
integration since it actually sends emails.
