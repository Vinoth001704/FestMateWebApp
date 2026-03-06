import React, { useEffect } from 'react'

export const Settings = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
   <>
   
   
   </>
  )
}
