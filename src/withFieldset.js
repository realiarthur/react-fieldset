import React from 'react'
import { useFieldset } from './useFieldset'

export const withFieldset = InnerComponent =>
  function WithFieldset(props) {
    const { fullName, fieldsetProps } = useFieldset(props.name)
    return <InnerComponent {...fieldsetProps} {...props}  name={fullName} />
  }

// deprecated since 4.0
export const withFullName = InnerComponent =>
  function WithFullName(props) {
    const { fullName } = useFieldset(props.name)
    return <InnerComponent {...props} fullName={fullName} />
  }
