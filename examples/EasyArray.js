import React from 'react'
import { useField, Field as _Field } from 'formik'
import Fieldset, { withFieldset, useFieldset } from '../dist/'

export const Field = withFieldset(_Field)

const EasyArray = ({ name = '', keyProp = 'id', children, ...props }) => {
  const { fullName, fieldsetProps } = useFieldset(name)
  const [{ value }] = useField(fullName)

  return value.map((item, index) => (
    <Fieldset {...fieldsetProps} {...props} key={item[keyProp]} name={`${name}[${index}]`}>
      {children}
    </Fieldset>
  ))
}

export default EasyArray
