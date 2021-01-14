

import React, { useState, useEffect } from 'react'
import axios from 'axios'


const LeagueTable = () => {

  const [table, updateTable] = useState(
    [{
      'position': 1,
      'team': {
        'id': 338,
        'name': 'Leicester City FC',
        'crestUrl': 'https://crests.football-data.org/338.svg'
      },
      'playedGames': 8,
      'form': 'W,W,W,L,L',
      'won': 6,
      'draw': 0,
      'lost': 2,
      'points': 18,
      'goalsFor': 18,
      'goalsAgainst': 9,
      'goalDifference': 9
    },
    {
      'position': 2,
      'team': {
        'id': 73,
        'name': 'Tottenham Hotspur FC',
        'crestUrl': 'https://crests.football-data.org/73.svg'
      },
      'playedGames': 8,
      'form': 'W,W,W,D,W',
      'won': 5,
      'draw': 2,
      'lost': 1,
      'points': 17,
      'goalsFor': 19,
      'goalsAgainst': 9,
      'goalDifference': 10
    },
    {
      'position': 3,
      'team': {
        'id': 64,
        'name': 'Liverpool FC',
        'crestUrl': 'https://crests.football-data.org/64.svg'
      },
      'playedGames': 8,
      'form': 'D,W,W,D,L',
      'won': 5,
      'draw': 2,
      'lost': 1,
      'points': 17,
      'goalsFor': 18,
      'goalsAgainst': 16,
      'goalDifference': 2
    },
    {
      'position': 4,
      'team': {
        'id': 340,
        'name': 'Southampton FC',
        'crestUrl': 'https://crests.football-data.org/340.svg'
      },
      'playedGames': 8,
      'form': 'W,W,W,D,W',
      'won': 5,
      'draw': 1,
      'lost': 2,
      'points': 16,
      'goalsFor': 16,
      'goalsAgainst': 12,
      'goalDifference': 4
    },
    {
      'position': 5,
      'team': {
        'id': 61,
        'name': 'Chelsea FC',
        'crestUrl': 'https://crests.football-data.org/61.svg'
      },
      'playedGames': 8,
      'form': 'W,W,D,D,W',
      'won': 4,
      'draw': 3,
      'lost': 1,
      'points': 15,
      'goalsFor': 20,
      'goalsAgainst': 10,
      'goalDifference': 10
    },
    {
      'position': 6,
      'team': {
        'id': 58,
        'name': 'Aston Villa FC',
        'crestUrl': 'https://crests.football-data.org/58.svg'
      },
      'playedGames': 7,
      'form': 'W,L,L,W,W',
      'won': 5,
      'draw': 0,
      'lost': 2,
      'points': 15,
      'goalsFor': 18,
      'goalsAgainst': 9,
      'goalDifference': 9
    },
    {
      'position': 7,
      'team': {
        'id': 62,
        'name': 'Everton FC',
        'crestUrl': 'https://crests.football-data.org/62.svg'
      },
      'playedGames': 8,
      'form': 'L,L,L,D,W',
      'won': 4,
      'draw': 1,
      'lost': 3,
      'points': 13,
      'goalsFor': 16,
      'goalsAgainst': 14,
      'goalDifference': 2
    },
    {
      'position': 8,
      'team': {
        'id': 354,
        'name': 'Crystal Palace FC',
        'crestUrl': 'https://crests.football-data.org/354.svg'
      },
      'playedGames': 8,
      'form': 'W,L,W,D,L',
      'won': 4,
      'draw': 1,
      'lost': 3,
      'points': 13,
      'goalsFor': 12,
      'goalsAgainst': 12,
      'goalDifference': 0
    },
    {
      'position': 9,
      'team': {
        'id': 76,
        'name': 'Wolverhampton Wanderers FC',
        'crestUrl': 'https://crests.football-data.org/76.svg'
      },
      'playedGames': 8,
      'form': 'L,W,D,W,W',
      'won': 4,
      'draw': 1,
      'lost': 3,
      'points': 13,
      'goalsFor': 8,
      'goalsAgainst': 9,
      'goalDifference': -1
    },
    {
      'position': 10,
      'team': {
        'id': 65,
        'name': 'Manchester City FC',
        'crestUrl': 'https://crests.football-data.org/65.svg'
      },
      'playedGames': 7,
      'form': 'D,W,D,W,D',
      'won': 3,
      'draw': 3,
      'lost': 1,
      'points': 12,
      'goalsFor': 10,
      'goalsAgainst': 9,
      'goalDifference': 1
    },
    {
      'position': 11,
      'team': {
        'id': 57,
        'name': 'Arsenal FC',
        'crestUrl': 'https://crests.football-data.org/57.svg'
      },
      'playedGames': 8,
      'form': 'L,W,L,L,W',
      'won': 4,
      'draw': 0,
      'lost': 4,
      'points': 12,
      'goalsFor': 9,
      'goalsAgainst': 10,
      'goalDifference': -1
    },
    {
      'position': 12,
      'team': {
        'id': 563,
        'name': 'West Ham United FC',
        'crestUrl': 'https://crests.football-data.org/563.svg'
      },
      'playedGames': 8,
      'form': 'W,L,D,D,W',
      'won': 3,
      'draw': 2,
      'lost': 3,
      'points': 11,
      'goalsFor': 14,
      'goalsAgainst': 10,
      'goalDifference': 4
    },
    {
      'position': 13,
      'team': {
        'id': 67,
        'name': 'Newcastle United FC',
        'crestUrl': 'https://crests.football-data.org/67.svg'
      },
      'playedGames': 8,
      'form': 'L,W,D,L,W',
      'won': 3,
      'draw': 2,
      'lost': 3,
      'points': 11,
      'goalsFor': 10,
      'goalsAgainst': 13,
      'goalDifference': -3
    },
    {
      'position': 14,
      'team': {
        'id': 66,
        'name': 'Manchester United FC',
        'crestUrl': 'https://crests.football-data.org/66.svg'
      },
      'playedGames': 7,
      'form': 'W,L,D,W,L',
      'won': 3,
      'draw': 1,
      'lost': 3,
      'points': 10,
      'goalsFor': 12,
      'goalsAgainst': 14,
      'goalDifference': -2
    },
    {
      'position': 15,
      'team': {
        'id': 341,
        'name': 'Leeds United FC',
        'crestUrl': 'https://crests.football-data.org/341.svg'
      },
      'playedGames': 8,
      'form': 'L,L,W,L,D',
      'won': 3,
      'draw': 1,
      'lost': 4,
      'points': 10,
      'goalsFor': 14,
      'goalsAgainst': 17,
      'goalDifference': -3
    },
    {
      'position': 16,
      'team': {
        'id': 397,
        'name': 'Brighton & Hove Albion FC',
        'crestUrl': 'https://crests.football-data.org/397.svg'
      },
      'playedGames': 8,
      'form': 'D,L,D,D,L',
      'won': 1,
      'draw': 3,
      'lost': 4,
      'points': 6,
      'goalsFor': 11,
      'goalsAgainst': 14,
      'goalDifference': -3
    },
    {
      'position': 17,
      'team': {
        'id': 63,
        'name': 'Fulham FC',
        'crestUrl': 'https://crests.football-data.org/63.svg'
      },
      'playedGames': 8,
      'form': 'L,W,L,D,L',
      'won': 1,
      'draw': 1,
      'lost': 6,
      'points': 4,
      'goalsFor': 7,
      'goalsAgainst': 15,
      'goalDifference': -8
    },
    {
      'position': 18,
      'team': {
        'id': 74,
        'name': 'West Bromwich Albion FC',
        'crestUrl': 'https://crests.football-data.org/74.svg'
      },
      'playedGames': 8,
      'form': 'L,L,D,D,L',
      'won': 0,
      'draw': 3,
      'lost': 5,
      'points': 3,
      'goalsFor': 6,
      'goalsAgainst': 17,
      'goalDifference': -11
    },
    {
      'position': 19,
      'team': {
        'id': 328,
        'name': 'Burnley FC',
        'crestUrl': 'https://crests.football-data.org/328.svg'
      },
      'playedGames': 7,
      'form': 'D,L,L,D,L',
      'won': 0,
      'draw': 2,
      'lost': 5,
      'points': 2,
      'goalsFor': 3,
      'goalsAgainst': 12,
      'goalDifference': -9
    },
    {
      'position': 20,
      'team': {
        'id': 356,
        'name': 'Sheffield United FC',
        'crestUrl': 'https://crests.football-data.org/356.svg'
      },
      'playedGames': 8,
      'form': 'L,L,L,D,L',
      'won': 0,
      'draw': 1,
      'lost': 7,
      'points': 1,
      'goalsFor': 4,
      'goalsAgainst': 14,
      'goalDifference': -10
    }])

  // useEffect(() => {
  //   axios.get(('https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/competitions/2021/standings'), {
  //     headers: { 'X-Auth-Token': '8cb5db16421541aca93046d17d386289' }
  //   })
  //     .then(resp => {
  //       updateTable(resp.data.standings[0].table)
  //       console.log(resp.data.standings[0].table)
  //     })
  // }, [])


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

  function splitForm(form) {
    return form.replace(/,/gi, '').split('')
  }

  console.log(splitForm(table[0].form))

  if (table[0] === undefined) {
    return <></>
  } else {

    return <>
      <table className="table is-striped">
        <thead>
          <tr>
            <th><abbr title="Position">Pos</abbr></th>
            <th className="logo">L</th>
            <th>Team</th>
            <th><abbr title="Played">Pld</abbr></th>
            <th><abbr title="Won">W</abbr></th>
            <th><abbr title="Drawn">D</abbr></th>
            <th><abbr title="Lost">L</abbr></th>
            <th><abbr title="Goals for">GF</abbr></th>
            <th><abbr title="Goals against">GA</abbr></th>
            <th><abbr title="Goal difference">GD</abbr></th>
            <th><abbr title="Points">Pts</abbr></th>
            <th><abbr title="Form">Form</abbr></th>
          </tr>
        </thead>
        <tbody>
          {table.map((team, index) => {
            return <tr key={index} className={buildClasses(team, index)}>
              <th>{team.position}</th>
              <th style={{
                backgroundImage: `url(${team.team.crestUrl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}></th>
              <td className="team">
                <p>{(team.team.name).replace('FC', '')}</p>
              </td>
              <td>{team.playedGames}</td>
              <td>{team.won}</td>
              <td>{team.draw}</td>
              <td>{team.lost}</td>
              <td>{team.goalsFor}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalDifference}</td>
              <td>{team.points}</td>
              <td>{(team.form).replace(/,/gi, ' ')}</td>
            </tr>
          })}
        </tbody>
      </table>

    </>
  }
}

export default LeagueTable
