<div align="center" style="height:200px;">
    <img src="./design/logo-white.png">
</div>

---

# TrackTician

![Python](https://img.shields.io/static/v1?label=Python&message=3.11.2&color=blue&logo=python&logoColor=ffffff)
![Flask](https://img.shields.io/static/v1?label=Flask&message=2.2.0&color=blue&logo=flask&logoColor=ffffff)

![GitHub repo size](https://img.shields.io/github/repo-size/Natte2110/TrackTician?color=orange&logo=github-actions&logoColor=ffffff) ![GitHub pull requests](https://img.shields.io/github/issues-pr/Natte2110/TrackTician?logo=github-actions&logoColor=ffffff)

TrackTician is an innovative web application designed to empower Formula One strategists with real-time, data-driven insights, enabling them to make precise and effective decisions in the heat of a race. 

## Key Features:

- **Comprehensive Race Analytics:** Gain access to in-depth race analytics to analyze performance metrics and trends.

- **Intuitive Visualization Tools:** Visualize complex data sets with intuitive and interactive visualization tools for enhanced decision-making.

- **User-Friendly Interface:** Seamlessly navigate through TrackTician's user-friendly interface designed for ease of use and accessibility.

## Benefits:

- **Optimized Race Strategies:** Leverage TrackTician's insights to optimize race strategies and gain a competitive edge.

- **Anticipate Competitor Moves:** Stay ahead of the competition by anticipating competitor moves and adjusting strategies in real-time.

- **Achieve Victory on the Track:** With TrackTician, teams can make informed decisions that increase the likelihood of achieving victory on the track.

By harnessing the power of cutting-edge technology, TrackTician equips teams with the essential tools they need to maximize performance and achieve success in Formula One racing.

*This project was made in accordance with the [Inversity](https://inversity.co/) challenge running from 09/02/24 - 10/03/24*

---

## Table of Contents

1. [**Market Research**](#market-research)
    - [**Inversity ChatBot**](#inversity-chatbot)
    - [**Further Research**](#further-research)
        - [**Blogs**](#blogs)
        - [**Podcasts**](#podcasts)
        - [**YouTube**](#youtube)
        - [**Miscellaneous**](#miscellaneous)

---

## Market Research

In this section, I will highlight and explains areas of research conducted prior to starting the development process.

By researching suitable areas first, I will be able to identify pertinent points in which to focus on, and understand completely what it is I am trying to achieve with this project.

### Inversity ChatBot

The [Inversity](https://inversity.co/) Chat Bot, dedicated to this challenge, offered invaluable assistance. With initial project specifications being vague, the Chat Bot provided essential insights into the requirements, setting a solid starting point.

Below I will highlight some of the most effective prompts and responses from the Chat Bot.

**"What forms of data do you look at when making decisions?"**

<details>
<summary>Reponse</summary><br>
"We look at a variety of data, including timing data that shows us the sector and lap times of all cars, GPS data for tracking car positions and performance, and simple telemetry data like throttle and brake usage. We also review onboard videos and listen to driver radio communications. All this information helps us understand the car's performance, the condition of the tyres, and what our competitors are doing, which is crucial for making quick and informed race strategy decisions."
</details>

<br>

**"What decisions does this data lead to?"**

<details>
<summary>Reponse</summary><br>
"The data leads to decisions like when to pit for new tyres, which tyre compound to choose, and how to manage the race pace. We also decide whether to be aggressive or conservative with our strategy, when to react to competitors' moves, and how to handle unexpected events like safety cars or changes in weather. The goal is to optimize our race performance and outsmart the competition, aiming for the best possible finish for our drivers."
</details>

<br>

**"Can you summarise the types of data that affect each decision in a bullet point style?"**

<details>
<summary>Reponse</summary><br>
"Sure, I can summarize it in a more conversational way using bullet points:

- Timing data helps us decide on pit stop timing and to understand our relative race pace.
- GPS data is useful for fine-tuning car setup and driving lines, as well as anticipating competitors' moves.
- Telemetry data informs us on tyre wear and whether adjustments to driving style are needed to preserve the car.
- Onboard videos can be reviewed for driver technique and identifying areas of the track where we can gain or lose time.
- Driver radio communications give us insight into the driver's comfort with the car and any immediate issues that need addressing.

Each type of data contributes to the overall strategy and the decisions we make throughout the race."
</details>

<br>

**"Can you summarise the types of data that affect each decision in a bullet point style?"**

<details>
<summary>Reponse</summary><br>
"We're always looking to improve our decision-making process. A few things that could help include:

- Enhanced data analysis tools that can quickly sift through large volumes of data and highlight the most critical information.
- AI-driven predictions that can anticipate race developments, like tyre performance under different conditions.
- Improved visualization of data to make complex information more understandable at a glance.
- Software that can summarize and prioritize radio communications from competitors, giving us strategic insights without the cognitive overload.

These advancements would help us make even faster and more accurate decisions during the high-pressure environment of a race."
</details>

<br>

**"What challenges do you currently face when making decisions during races?"**

<details>
<summary>Reponse</summary><br>
"One of the biggest challenges is the sheer volume of data we receive; it can be overwhelming. We need to identify key information quickly to make informed decisions. Another challenge is dealing with conflicting data from different sources, which can create uncertainty. Additionally, we have to be very agile, responding to changing race conditions and competitor strategies in real-time, which requires both speed and accuracy in our decision-making process."
</details>

<br>

**"Are there any other challenges you haven't mentioned?"**

<details>
<summary>Reponse</summary><br>
"Yes, there are a few more challenges:

- Interpreting the reliability and accuracy of the data, especially when the quality can vary, like with GPS signals on certain tracks.
- Managing communication effectively among the team, ensuring that crucial information is shared without distraction.
- Adapting to unexpected events, such as accidents or safety cars, which can turn the race on its head and require a rapid reassessment of strategy.
- Balancing risk versus reward when considering different strategic options, which can have a significant impact on the race outcome.

These challenges require a combination of experience, intuition, and robust software tools to navigate successfully."
</details>

<br>

**"How effective would a geospatial visualisation be for the team?"**

<details>
<summary>Reponse</summary><br>
"A geospatial visualization could be very effective for our team. It would allow us to see the real-time positions of our cars in relation to others on the track, understand spatial relationships and gaps, and make more informed decisions about overtaking, defending, and pit stop timing. If it's intuitive and quick to interpret, it could be a valuable addition to our strategy toolkit."
</details>

### Further Research

In this section, I will highlight areas of further research conducted, picking out the pertinent points that will affect the project development.

#### Blogs

Blogs appeared as a great place to start. They provide more information as to what teams focus on when making decisions as well as the currently available technology for decision making.

I will highlight certain sections of blogs along with the information taken forward.

- [Catapult "F1 STRATEGY: HOW FORMULA 1 TEAMS OPTIMIZE ANALYSIS"](https://www.catapult.com/blog/formula-1-race-strategy-analysis)
    - During a race weekend, teams closely monitor **tyre wear**, **temperature**, and **performance** to make informed decisions about *when to change tyres* and *which type of tyres to use*.
    - By considering factors like **track temperature**, **tyre wear rates**, and **lap times**, they can make informed decisions about when to pit and which tyres to use.

The information extracted from the above blog assisted in understanding what factors assist with decision making when deciding when to change tyres, and what type of tyre to use. This will be taken forward to prvide a form of predictive analysis for tyre management.

- [Secrets of the Pit Wall | The Art of Race Strategy in F1](https://www.linkedin.com/pulse/secrets-pit-wall-art-race-strategy-f1-anish-garg/)
    - F1 teams have access to extensive **weather forecasting tools**, which are constantly monitored during the race. If rain clouds loom on the horizon, the strategists must decide *when and if to switch to wet tires*.
    - An undercut is where a driver pits before the car(s) in front to try and gain a position. This occurs when a team believes fresh rubber will yield more pace and create a net gain on the track by the time the other car(s) have pitted.
    - The overcut is essentially the opposite of the undercut, in that it involves letting the leading car pit first, and then taking advantage of the clean air in front of you to build up a gap so that when you do eventually pit, you still come out of the pits ahead of the driver that was originally in front.

The above information will help understand the principles behind undercuts and overcuts, alongside important weather considerations.

#### Podcasts

#### YouTube

#### Miscellaneous