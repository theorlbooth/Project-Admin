import React, { useState } from 'react'



const SearchInput = (props) => {

  async function checkEnter(event) {
    const key = event.keyCode
    if (key === 13) {

      if (event.target.value === '') {
        props.updateLocation('e106nj')
      } else {
        props.updateLocation(event.target.value)
      }
    }
  }

  return <>
    <section className="search">
      <input className="search_input" placeholder='...' onKeyDown={event => checkEnter(event)}></input>
    </section>
  </>
}


export default SearchInput