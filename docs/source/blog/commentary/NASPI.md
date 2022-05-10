North American Synchrophasor Initiative (NASPI) Technical Report 2020
--
*This post provides an overview of the Continuous Point on Wave Data (CPOW) overview from NASPI Technical Report (2020) The original report can be found here:* [https://www.naspi.org/node/819](https://www.naspi.org/node/819)


Continuous Point on Wave Data *(CPOW)* capture the highest resolution of time series data for power systems monitoring when compared to synchrophasor *(PMU)* or *SCADA* data.  Current practices of power systems monitoring use SCADA data, which has a sample rate of 4-6 second intervals or else PMU data which samples at rates of 30-60 measurements per second. This NASPI paper advocates for the use of continuous point on wave data, (CPOW) taking measurements at a rate of 256 samples per second or faster. 

While some parts of the grid use this high resolution data, it is generally event-triggered recording of grid conditions. This data is then retained data for post event analysis, real time streaming ability, or archiving streaming data. This event-triggered aproach is not optimal, which will be discussed in further detail below. 

Continuous point on wave data must meet three characteristics:
-   *Waveform sampling*– sampling of the analogue waveform as opposed to fitting the measurement to a sinusoid wave form (sine wave).
    
-   *High data accessibility*– data must be readily accessible, through methods such as relaying information to a cloud server.
    
-   *Time Synchronization*- time-stamped data should be uniformly synchronized across sensors via *Coordinated Universal Time (UTC)*. When locally collected time stamps aren’t verified across wide geographic areas, this can be problematic for modeling if samples are not synchronized.
    
In short, continuous, non-triggered CPOW data allow us to understand the complexities of the grid with system view understanding that is undprecedented. According to NASPI, “The lack of high-resolution, longer-duration, archived CPOW data is limiting our ability to understand and diagnose high-speed grid conditions and events” (NASPI, p.5). Below we can see the difference in resolution between CPOW and PMU data. As we can see, the POW measurement is a significantly more accurate since it records the actual waveform, capturing details that phasor approximation misses.

![](https://lh6.googleusercontent.com/50roRn1OX7JeyDn34rLL8JwVfnAb4cvXBz7O5-nTAN2DuNlv1KDuEsSDI3iLip-Nw_7jeDN3Q250WtDX1IEEPbFicbKMKpMy_rpNyXF5O-EnC42zLIN2bNkCvDIh3yUbVacW6-tAnM3PRD435Q)

*(NASPI, pg. 11)*

Multiple End-Uses and DERs
--

The *energy mix* is a group of different primary energy sources from which secondary energy for direct use - such as electricity - is produced. Historically, this system consisted of few coal-fired power plants supplying the primary source of energy for a given location. When alternative energy generation sources are deployed across the grid, this significantly complicates the system dynamics compared to just a small number of fixed energy sources. These distributed energy resources *(DERs)*, such as solar, wind, and hydroelectric resources, are essential for propelling the green energy transition forward. Within the United States, DER penetration to the energy mix is now approaching 10% (p.19)! Furthermore, DERs are growing faster than any other energy generation source. 

Both industrial sized generation operations and individual consumers seek to sell energy back to the grid. This can be problematic as well when monitoring is only happening at the inverter as opposed to at the individual generation sources. Meanwhile, monitoring devices are not capturing needed data on fast events, such as inverter-related resource behaviors that can cause faults. Understanding how inverter health relates to system health is an area ripe for further study. 

There are interesting use cases beyond monitoring inverters that convert direct current (*DC*) energy to alternating current (*AC)*, a change required to transmit this generated electricity across the grid. For example, wind turbine oscillations that can lead to unexpected faults. 

  
Notedly, Digital Fault Recorders (DFRs) and Dynamic Disturbance Recorders (DDRs) do recording high resolution data at 960 samples per second and >30 samples per second respectively, however, these measurements are event triggered meaning that they collect data in windows rather than continuously. Since they are triggered in the case of predetermined event-conditions, they are not suitable to investigate the very events in which they may need to be triggered. (p.19). Continuous data is therefore necessary to understand transient stability failures that can occur within just a few cycles in areas with high penetration of inverted-based generation sources.


Effects of inverted based resources can include:

-   Voltage fluctuations
    
-   Reverse power flows
    
-   Low-fault currents
    
    
In addition, applications for monitoring are required due to the changing character of end-use loads. End-use loads are currently dramaticay different than those in place when much of the grid was first built. This is conveniently elaborated below: 


![](https://lh3.googleusercontent.com/ekkW6UECDMo6yE2bQM6wMZsxk5CsbTC2BiN8zlZOBvok9La_j5pw0xqvJAxybn0g3N0GTbIYAdwJwagpy0mYogAqG4LAdRLHxK3QCFspGhEWCRsXR5LNb2P_BGcaJ-pIkQGeSiuIMyU1f79U7w)
Geomagnetically induced currents (GIC) are also an interesting use case for CPOW analysis. Hydro Quebec found that “fine-grained, localized analysis of geomagnetic activity within a three hour time window can be used to predict potential impact at nearby locations on the grid” and can alert operators in advance of large-scale geomagnetic disturbance (GMD) events. 

Importantly, while this new higher-resolution data provides new insights, it is meant to combine with other current data types (SCADA, PMU) to provide a holistic system understanding. SCADA monitoring can generate 21,600 records per day, while a PMU over 5 million and a CPOW 124 million (p. 31). The NASPI paper argues for streaming CPOW data to a central source, since in the event of a fault, a local system may not be capable of operating, analyzing the event, and intervening. More uses on combining data types are outlined below:

![](https://lh4.googleusercontent.com/y_FFyz01ACCJVAFfVYrQLLPZNI2OMLGejTqzLiirco6VdQR7_5xArGcMq__ENu-bNRJSkot_E_cimXJp-zHx4SwNAsrO9QaV1_NDMOhocqjneNKsU_ObG5rW_ZgCKyMwZFKmzCnKA-jn2APazg)

 
Moreover, current data protocols used to stream real-time PMU data have quality issues due to data losses (UDP) and latency (TCP). The DoE has funded the Grid Protection Alliance to develop the Streaming Telemetry Transport Protocol (STTP) designed to transmit PMU or POW data with lossless compression.

In conclusion, CPOW data's higher sampling rate enables a much higher resolution for data analysis than PMU data. Similarly to how PMUs did not replace SCADA immediately but instead gradually have become deployed on the grid, it is expected that CPOW sensors will complement PMUs rather than replace them. Modern solutions will require joining many types of data together to analyze system dynamics. As DER’s are rapidly integrated into the grid, inverter-specific use cases may become increasingly necessary for research.
