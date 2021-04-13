import React, { memo } from 'react'
import { FieldsetContext } from './index'
import { useFieldset } from './useFieldset'

const Fieldset = function Fieldset({ name, children, ...otherProps }) {
  const { fullName, fieldsetProps } = useFieldset(name)

  return (
    <FieldsetInner {...fieldsetProps} {...otherProps} name={fullName}>
      {children}
    </FieldsetInner>
  )
}

const FieldsetInner = memo(function FieldsetInner({ children, ...props }) {
  return <FieldsetContext.Provider value={props}>{children}</FieldsetContext.Provider>
})

export default Fieldset
