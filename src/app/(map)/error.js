'use client'
import NotFound from "./(root)/not-found"
 
export default function Error({ error, reset }) {

  console.log(error)
  /*
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )*/
  return (
    <NotFound />
  )

}