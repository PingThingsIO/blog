# PingThings Blog

**The analytics blog for the ARPA-E National Infrastructure for Artificial Intelligence project.**

## Authoring Articles

Articles are written in markdown syntax. Here is a guide on [basic markdown syntax](https://www.markdownguide.org/basic-syntax) and here is another on [extended syntax](https://www.markdownguide.org/extended-syntax).

New articles should be archived under the appropriate directory in `docs/source/`. The blog is organized as follows:
- `docs/source/blog` includes traditional blog posts, or commentary about the data, project or industry.
- `docs/source/data` provides detailed documentation about open access data hosted as part of NI4AI.
- `docs/source/learn` offers a deep dive into analytical methods used to process time series (and particularly PMU) data.
- `docs/source/quickstart` is a one-stop-shop for new users just getting started using the platform.
- `docs/source/tutorials` include tutorials for new users to learn / practice typical platform workflows. It covers fundamental concepts such as querying streams, working with statpoints, and deciding when to use windows, aligned_windows and values queries.
- `docs/source/workshops` lists video recordings of workshops hosted as part of the NI4AI project.

## About

The blog uses Sphinx and is hosted on readthedocs.io. 

### Development

To start, navigate to the directory `blog/docs` and install dependencies:

```
pip install -r requirements.txt
```

To deploy the blog locally, you can run:

```
sphinx-build source build
```

You can view and navigate (and validate) the resulting HTML files by opening the file `docs/build/index.html`.


### Deploying the Site

