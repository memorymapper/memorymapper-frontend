'use client'
import NotFound from "./(root)/not-found"
 
export default function Error({ error, reset }) {

  console.log(error)
  return (
    <NotFound />
  )

}