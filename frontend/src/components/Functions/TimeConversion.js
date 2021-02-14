export function secondConverter(time) {

  function recuF(seconds, count) {
    count = count || 0
    if (seconds - 60 < 0) {
      return [count, seconds]
    } else {
      count += 1
      return recuF(seconds - 60, count)
    }
  }

  if (time < 3600) {
    const newTime = recuF(time)
    if (newTime[1] < 10) {
      return `${newTime[0]}:${newTime[1]}0`
    } else {
      return `${newTime[0]}:${newTime[1]}`
    }
  } else {
    const newTime = recuF(time)
    const hours = Math.floor(newTime[0] / 60)
    const minutes = newTime[0] % 60
    if (minutes < 10 && newTime[1] < 10) {
      return `${hours}:0${minutes}:0${newTime[1]}`
    } else if (minutes < 10) {
      return `${hours}:0${minutes}:${newTime[1]}`
    } else if (newTime[1] < 10) {
      return `${hours}:${minutes}:0${newTime[1]}`
    } else {
      return `${hours}:${minutes}:${newTime[1]}`
    }
  }
}

console.log(secondConverter(8000))