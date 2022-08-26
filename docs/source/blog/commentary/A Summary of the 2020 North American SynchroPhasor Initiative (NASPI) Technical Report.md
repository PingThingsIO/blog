# A Summary of the 2020 North American SynchroPhasor Initiative (NASPI) Technical Report
This blog post will summarize key findings from the 2020 NASPI Technical Report  

The 2020 NASPI Technical Report advocates for continuous recording of grid conditions with continuous point on wave data (CPOW) rather than event-triggered continuous recording of grid conditions. Continuous point on wave requires retained data for post event analysis, real time streaming ability, and archiving of streaming data. Continuous point on wave data is at the cutting edge of grid technology: it records even faster than synchrophasor measurement, as much as 256 data points recorded per second.

Continuous point on wave data must meet three characteristics:
-   *Waveform sampling*– sampling of the actual, analogue waveform as opposed to fitting the measurement to a sinusoid wave form (sine wave).
-   *High data accessibility*– even when systems may go down, data must be readily accessible, likely through cloud storage.
-   *Time Synchronization*- time-stamped data should be uniformly synchronized across sensors via *Coordinated Universal Time (UTC)*. When locally collected time stamps aren’t verified across wide geographic areas, this can be problematic for modeling if samples are not synchronized.
    
Continuous *Point on Wave Data (CPOW)* capture the highest resolution of time series data for power systems monitoring when compared to *PMU* (synchrophasor) or *SCADA* data.  Current practices of power systems monitoring often use SCADA at a sample rate of 4-6 second intervals or else PMUs which samples at rates of 30-60 measurements per second. This NASPI paper advocates for the deployment of continuous point on wave monitors, (CPOW) taking measurements at a rate of 256 samples per second or faster. SCADA monitoring can generate 21,600 records per day, while a PMU over 5 million and a CPOW 124 million (pg. 31)! 

Similarly to how PMUs did not replace SCADA immediately but instead gradually have become deployed on the grid, it is expected that CPOW sensors will complement PMUs rather than replace them. Long-duration, high-resolution data allow us to understand the complexities of the grid at a holistic level previously unseen. According to NASPI, *“The lack of high-resolution, longer-duration, archived CPOW data is limiting our ability to understand and diagnose high-speed grid conditions and events” (NASPI, pg.5).* 

--
[https://www.naspi.org/node/819](https://www.naspi.org/node/819)


![enter image description here](https://lh6.googleusercontent.com/50roRn1OX7JeyDn34rLL8JwVfnAb4cvXBz7O5-nTAN2DuNlv1KDuEsSDI3iLip-Nw_7jeDN3Q250WtDX1IEEPbFicbKMKpMy_rpNyXF5O-EnC42zLIN2bNkCvDIh3yUbVacW6-tAnM3PRD435Q)

*(NASPI, pg. 11)*

In the example above, we can see how continuous measurement is able to capture the minute details of a change in conditions. Even when the phasor approximation is fairly accurate, the point on wave measurement is able to catch changes that are just too fast for a PMU's to even record. 

In conclusion, CPOW data are a much higher resolution than PMU data. Exciting use cases such as cybersecurity, DER integration, wildfire prevention, solar forecasting and others are quickly becoming of interest to power system engineers. These modern solutions will require joining many types of data together to analyze system dynamics, and CPOW data provides the clearest resolution to make this analysis possible. CPOW data is not meant to be used alone, but rather, all of the sensor types can be used together to provide the clearest picture of grid health. 
This post provides an overview of *Continuous Point on Wave Data (CPOW)* from the NASPI Technical Report (2020). The original report can be found here: 
