# ist-vercel-demo

This is a repo that has some examples of how to use vercel endpoints to pipe data in from a data endpoint.
Vercel is an interesting way of being able to ship web components in a way that come with a backend
built in to serve (or store) data needs using the same CI/CD pipeline.

## Will this scale though?
Maybe? Honestly in how we're going to play in class, no. But as far as organic distribution of building blocks
this is a great way to play with web components, build a small back end, document an API, and that 3 step process
is in effect building a functioning micro frontend.

## How could it scale
For our purposes here I'm saying "scale" as in human scale. Like mass adoption or usage throughout your company
- You'd have vercel or a similar app pipeline to test and build microservices for your elements
- You'd have something building and shipping your web component defitions to a CDN
- Storage would be in MongoDB / AWS / some place
- You'd use the brick anywhere, the bricks would tap vercel based endpoints, which store / retreive data from AWS

# Getting started
We need a new command to work with vercel locally
```
# the -g flag says to install it globally for your computer to use anywhere
npm i -g vercel
# or if you use yarn, global here is the same as npm call
yarn global add vercel
```
