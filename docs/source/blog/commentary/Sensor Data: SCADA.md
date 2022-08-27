# Sensor Data: SCADA

In our last blog series we discussed substations which are the locations where electricity may be split, controlled, and transformed. One may notice, however, that these are often--if not always-- empty. This is where supervisory control units, sensors, and automation come into play. Grid sensors and their data have evolved from SCADA, to synchrophasors and digital fault recorders, and most recently to measuring continuous point on wave data (CPOW). 


**How do we currently monitor the grid? What is SCADA?**
Sensor monitoring technology continues to evolve in the utility space. First used as early as 1920 and popularized in the 1970's,*Supervisory Control and Data Acquisition (SCADA)* is the default system through which the power grid is both controlled and monitored.  In a SCADA system, a **remote terminal unit** (RTU) collects system data and communicates it to the Master Terminal Unit (MTU) and accompanying **Human Machine Interface** (HMI). **A programmable logic controller**, or PLC, discussed further below, may also take the place of an RTU. Control functionality sends information from the HMI back to the RTU to make the system adapt to changing conditions.  This data takes the form of voltage, current, and power readings.

Controls can be manual, where a system operator receives an alert and sends a command to the RTU, or else automated, where the system is programmed to respond when triggered by specific conditions. Alternatively, Programmable Logic Controllers (PLCs) can be programmed to perform more complex tasks than RTUs. This acquired data can also be stored in a database for future analysis. While RTUs are more straightforward for implementation and do not require programming, PLCs are much more versatile since they are programmed.

SCADA systems only take a measurement every 2-10 seconds. In the case of the grid, this measurement speed is be fast enough to alert the system operator of an outage, but could not detect something very quick, such as a voltage sag. One measurement every 2-10 seconds is simply not fast enough to paint a detailed, wide area view of system health. 

![enter image description here](https://ih1.dpstele.com/images/scadasys.png)

Sensor data from SCADA systems or other sources may be retained locally, or following more recent technology trends, it may be stored in a cloud based server off-site. This data is not only useful for real time applications, but also for keeping historical records. In the case of a blackout, historical data is essential to tracking down a root cause. 

While SCADA is very prevalent in the grid today, new sensor technology is rapidly improving our ability to understand how the interconnected features of the grid interact from moment to moment. In our next post, we will discuss how synchrophasors enable a more detailed understanding of the grid!
