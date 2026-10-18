


import { Loader } from '@mantine/core'
import React from 'react'

const LoadingFullPage = ({visible}) => {
  return (
    <div style={{zIndex:1100, top: 0, left: 0, height:'100%', width: '100%', position: 'fixed', display: visible ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(251, 247, 239, 0.75)'}}><Loader size={50} color="emerald"/></div>
  )
}

export default LoadingFullPage