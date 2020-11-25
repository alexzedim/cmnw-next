import Error from 'next/error'
import React from "react";

export default function Custom404({errorCode}) {
  return <Error statusCode={errorCode}/>
}

