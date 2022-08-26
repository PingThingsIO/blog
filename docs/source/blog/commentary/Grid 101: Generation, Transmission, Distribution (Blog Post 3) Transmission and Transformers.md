# Grid 101: Generation, Transmission, Distribution (Blog Post 3) Transmission and Transformers

While we may think that the power lines that provide the backdrop scenery to any modern city are uniform, there is a major difference between those that support electricity *transmission* and those that are used for *distribution*.  For starters, transmission lines are generally much, much larger, while distribution lines are what we are used to seeing lining our city streets on wooden poles. But what else differentiates the two? 

**What is the difference between transmission lines and distribution lines on the energy grid?**

While transmission lines are meant for transporting energy across a very great distance, distribution lines are for local energy distribution. Utilities are able to manipulate the relationship between voltage and current using **transformers** to "step-up" and "step-down" voltage.  Due to the special relationship between voltage and current, when a '**step-up transformer**' increases voltage, current subsequently decreases. Whenever we transmit energy, some of that energy is lost due to inefficiency and dissipates as heat. This makes high-voltage optimal for transporting electricity across long distances, since high voltage transmission loses less electricity through this heat dissipation. In fact,  in the US, we lose about 6% of our energy through heat loss. [(UCSUCA)](https://www.ucsusa.org/resources/how-electricity-grid-works)   

Alternatively, high-current transmission is much more dangerous than high voltage and would require very thick, heavy transmission lines. Furthermore, the standard distance between two transmission lines is about 300 miles. These costs would add up quickly and create a much less efficient system, so high current transmission is not feasible for industrial scale projects.  

![enter image description here](https://www.electricalvolt.com/wp-content/uploads/2021/11/step-up-step-down-transformer.jpg)

Once electricity is transported across high-voltage transmission lines, the voltage must be "stepped-down" with another transformer before it can be distributed through the local grid. This takes our voltage from 400,000 volts down to around 13,000 volts. However, before this electricity is used in our homes it must be stepped-down again to just 240 volts. The step-up and step-down transformers are primary components of **substations** (see below), which are commonly seen in any modern city, even in residential areas. Substations are gated hubs of switches, transformers, and control units; when you see an ominous "high-voltage, keep out!" sign, there is a good chance that you are probably looking at a substation!  

Within the substation, the key action performed is the step-up and step-down functionality described above. Diving into how the transformer works, first, conductive wire is wrapped around an iron core. In a step-down transformer, the output wiring is wrapped around the iron core with less 'turns' than the input. When we go from many wiring turns to fewer, voltage decreases, such as in the illustration below. In a step up transformer on the other hand, the opposite occurs. A step-up transformer consists of a fewer primary windings with greater secondary windings. 

**An example of a step-down transformer:**

![enter image description here](https://www.achrnews.com/ext/resources/2016/11-2016/11-21-16/FS-Btu-Buddy-164-Fig-1.jpg?t=1479314488&width=900)


** What is a substation on the electric grid?** 
The substation consists of transformers, switches, and busses. Aside from the transformer which manipulates voltage, a distribution bus allows the power from a high-voltage line to be split for distribution into many directions. Additionally, switches and breakers allow for lines to become disconnected if needed. Lastly, it is important to note that these substations are not monitored on-site by human interaction. Instead, supervisory control and data acquisition systems (SCADA) are in place to monitor the grid remotely. Our sensor series will discuss SCADA in more detail. 
![eTool : Electric Power Generation, Transmission, and Distribution -  Illustrated Glossary - Substations | Occupational Safety and Health  Administration](https://www.osha.gov/sites/default/files/inline-images/substation_energy_flow.jpg)


In conclusion, substations are an essential part of the grid. When electricity is generated, it must be transported very long distances across the grid. This is most efficient through high voltage, low current transmission. Since the relationship between voltage and current is inversely related, as voltage increases current decreases and vice versa. The step-up transformer is required to cause this change from low voltage to high voltage, and the step-down transformer does the opposite, returning the electricity back to low voltage and higher current. First we generate the electricity, then we transmit it over long distances, and finally we distribute it locally. 
