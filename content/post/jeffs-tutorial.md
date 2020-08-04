---
title: Jeff's tutorial
date: '2020-08-04T09:27:32-0400'
description: this is where jeff does a tutorial
featuredImage: '/assets/images/post/jeffs-tutorial/header.png'
tags: ["jeffs", "tutorial"]
author: sascha
---

_this is italics_

this is bold

**BTrDB is a next-gen timeseries database for high-precision, dense telemetry.**

## jeffs tutorial

While the connection between cardiology and power systems might not be immediately obvious, the study of medical electrocardiograms (ECG or EKG, from the original German) in fact shares important similarities with the study of grid data such as synchrophasors. In each case, we are looking at a time-series of voltage measurements. An EKG measures the voltage across the heart, which corresponds to the polarization of muscle tissue that makes it contract. Certain periodicities are expected -- for example, a regular heartbeat, or diurnal variations in load on the electric grid -- but within these basic rhythms lies a more subtle information-rich signature. In each case, we are interested in detailed variations on shorter time scales. For one, we look to infer things about the underlying structure of the system from the data -- for example, the size of heart chambers, or the impedance of a circuit. Also, we look for the distinction between healthy and unhealthy behaviors -- for example, whether a patient is having a heart attack, or whether there is a fault on the power system. With EKG and grid data side-by-side, the PredictiveGrid platform supports the exploration of algorithms that identify unique characteristics or anomalies in these time-series voltage data streams.

```python
import btrdb

db = btrdb.connect("api.ni4ai.org:4411", "myapikey")
patients = db.list_collections("Health/EKG")
```

this is a new paragraph

![EKG Data](/assets/images/post/ekg-data/ekg.gif)

<iframe width="560" height="315" src="https://www.youtube.com/embed/ITn5Q6W9RQY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[this is a link](https://google.com)
