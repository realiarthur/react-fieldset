import React from 'react'
import { Formik, Form } from 'formik'
import EasyArray, { Field } from './EasyArray'

const FormWithEasyArray = ({ data }) => {
  return (
    <Formik initialValues={data} onSubmit={values => console.log(values)}>
      <Form>
        <EasyArray name='array'>
          <EasyArray name='nestedArray'>
            <Field name='foo' />
            <Field name='boo' />
            <br />
          </EasyArray>
        </EasyArray>
        <button type='submit'>Submit</button>
      </Form>
    </Formik>
  )
}

export default FormWithEasyArray
