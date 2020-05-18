# PingThings Blog

**The analytics blog for the ARPA-E National Infrastructure for Artificial Intelligence project.**

## Getting Started

This blog uses [Gatsby](https://www.gatsbyjs.org/) static site generator.

### Developing

Before starting, please install dependencies:

    $ yarn

To start developing, just run:

    $ yarn start

It will automatically, build the pages in develop mode and spin a webserver (usually in `http://localhost:8000/`)


### Deploying the Site

Before deploying the site, you need to build the project by running:

    $ yarn build

This will build the site inside the `public/` folder. Then, to deploy just define your AWS credentials on `l.env` file.

After that, just run:

    $ yarn deploy

That will ultimately push the changes to the `S3` bucket.