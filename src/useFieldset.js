import { useContext } from 'react'
import { FieldsetContext } from './index'
import { prefixName } from './helpers'

export const useFieldset = name => {
  const fieldsetContext = useContext(FieldsetContext)

  if (fieldsetContext) {
    const { name: contextName, ...fieldsetProps } = fieldsetContext
    const fullName = prefixName(contextName, name)

    return { fullName, fieldsetProps, contextName }
  }

  return { fullName: name }
}
