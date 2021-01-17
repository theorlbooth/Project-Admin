# Project A: On-StartUp Admin Page


## Overview 
The idea with this project is to create an admin page that I can launch when opening a browser or turning on my computer and have everything I want to catch up on in one place rather than having to jump around. This is an ongoing project for which I am using React.

## Technologies

* React
* HTML
* CSS/SCSS
* Webpack
* Node.js

## Approach 

I havent taken any strict approach with this project and have instead started with technologies that I came across at the time and made notes of others to add as I came across them. 

### Time & Date 
I wanted a ticking clock that would show the up to date time in whatever timezone was inputed. This was very straightforward to implement using the react-libe-clock library. I already had the date from the API I was using for the weather so I used Moment to convert it back from a UNIX timestamp. The reason I chose to display this date, was that I knew I would want to use the future weather information that the API provides and therefore it seemed right to start as I meant to continue.

```
 <Clock format={'HH:mm:ss'} ticking={true} timezone={props.weatherInfo.timezone} />
 <h3>{moment.unix(props.weatherInfo.current.dt).format('Do MMMM YYYY')}</h3>
```

### Current Weather
I wanted a quick snapshot of the weather at my location on startup but I also wanted to be able to search for a location and get the same back. I wanted something that could be understood at a glance but have a bit more detail if required. It seemed natural to me to have the temperature and the weather icon stand out. The icons werent as staright forward as I would have liked, they werent presented as well as I would have liked by the API. I decided to spend a bit of time hard-coding these to avoid issues in getting them, however this presented it's own problems. For each icon there is a 'day' and 'night' version and therefore the time of sunset needs to be checked before displaying in order to get the right one.

```
if (props.weatherInfo.current.dt > props.weatherInfo.current.sunset) {
  src = iconMapping[props.weatherInfo.current.weather[0].description][1]
} else {
  src = iconMapping[props.weatherInfo.current.weather[0].description][0]
}
```

### Future Weather
Simply having the current weather displayed when there was so much more information available from the API seemed futile. I decided to display the next 24h and the next 7 days. However having these constantly on display would be annoying as it would take up too much space. I wanted to be able to show/hide these with a button. For this I used a piece of state for each passed down to the components as props.

```
<button className="show-hide" id="show-hide-1" onClick={() => {
    setShowHideTF(!showHideTF)
}}>Next 24 Hours</button>
<NextTF weatherInfo={weatherInfo} showHideTF={showHideTF} />
<button className="show-hide" id="show-hide-2" onClick={() => {
    setShowHideFD(!showHideFD)
}}>Next 7 Days</button>
<FutureDays weatherInfo={weatherInfo} showHideFD={showHideFD} />
```

### League Table
I wanted a quick snap shot of the league table and of my teams current position. For this I used a football data API. When I implemented this I had not learnt how to put together a backend yet so I used a CORS proxy to ping it. I used Bulma to style the table with a function to highlight my team, show the champions league/europa and relegation zones.

```
  function buildClasses(team, index) {
    const spurs = team.team.name
    if (spurs === 'Tottenham Hotspur FC' && index === 3 || spurs === 'Tottenham Hotspur FC' && index === 4 || spurs === 'Tottenham Hotspur FC' && index === 16) {
      return 'is-selected bottom-border'
    } else if (spurs === 'Tottenham Hotspur FC') {
      return 'is-selected'
    } else if (index === 3 || index === 4 || index === 16) {
      return 'bottom-border'
    }
  }
```
### Run Graph
I wanted to be able to have a quick glimpse at fitness progression without having to deep dive into an app. This is by no means meant to be comprehensive and I will continue to use the app when required, but more of a snapshot. I wanted to track distance and speed over time as these seemed the two most relevant and the two units I strive to improve on. To plot these I used [Recharts](https://recharts.org/en-US). 

I also wanted to be able to input the data from the UI and not having to change it in the code every time - for this I now needed a backend. Given that the information going in is pretty basic and this app is desgined for one user I decided to go with a NoSQL backend and follow the process of a MERN stack. 

Plotting over time I found to be a lot less straight forward than anticipated. I presumed there would be a prop for the graph that could be set to start date and one to be set to current date and it would deliver everything in between. This was not the case. I toyed with a couple of ideas about how to go about doing this manually. The first of which was to have a function in a setTimeout that would fire every 24h and update the days in the backend (with empty data). However I didnt really like this as I didnt think it was the cleanest method and if left unchecked could open the door to more issues in the future. In the end I decided to update the past dates only when a new entry is logged. For this I wrote a function that chaecks the last input and pushes the dates since to an array. Each item in this array is then posted to the backend before the new data is posted for the current date. 

(selected parts from full function):

```
    let now = new Date()
    now = now.setHours(0, 0, 0, 0)
    now = now - 86400000
    const datesBetween = []

    axios.get('/api/runs')
      .then(resp => {
        const data = resp.data
        let lastDate = data[data.length - 1].date
        lastDate = moment(lastDate).unix() * 1000
```

```
          if (lastDate < now) {
            while (lastDate < now) {
              datesBetween.push(lastDate + 86400000)
              lastDate += 86400000
            }
            datesBetween.forEach(date => {
              axios.post('/api/runs', { split: '', distance: '', date: date })
            })
          } else if (lastDate > (now + 86400000)) {
            const id = data[data.length - 1]._id

            axios.put(`/api/runs/${id}`, formData)
              .then(resp => {
                resp.data.forEach(item => {
                  item.date = moment(item.date).format('DD-MMM')
                })
                updateData(resp.data)
              })
            updateFormData({ distance: '', split: '', _id: '' })
            return
          }
```

## Screenshots

![screenshot](./screenshots/X_SS.png)
<img src="./screenshots/X_N7.png" alt="Next 7 Days" width="49.4%"> <img src="./screenshots/X_N24.png" alt="Next 24h" width="50.1%"> 
<img src="./screenshots/X_Lisbon.png" alt="Lisbon" width="33%"> <img src="./screenshots/X_Delhi.png" alt="Delhi" width="33%"> <img src="./screenshots/X_Shanghai.png" alt="Shanghai" width="33%">
<img src="./screenshots/X_Graph1.png" alt="Combined Graph">
<img src="./screenshots/X_Graph2.png" alt="Split Graph">



## KnownBugs
* ***Bulma*** - Having built the date/time/weather feature before doing the league table, once bulma was in place it slightly shifted the formatting I had in place. This should be a quick fix, but I have yet to address it.


## Future Features

* ***Show/Hide Columns on League Table*** - The table currently takes up quite a lot of space and isn't the 'snapshot' that I wanted. I will be putting in place a similar show/hide button that the weather currently has for most of the columns.

* ***Scores/Fixtures*** - I want to be able to see both the upcoming fixture and the most recent scores. Given the way the API returns information I will start by implementing this for the Premier League and then move onto other competitions.

* ***ToDo List*** - I want to put in a simple ToDo checklist.

* ***Email/Instant Message Window*** - Given that I want this to be an admin page I would like a way to be able to check messages quickly also. In an ideal world I would be able to reply to them from here also, but being able to see them would be a good starting point.

* ***Healines*** - I would like to display a qucik snapshot of both News and Sport headlines.
