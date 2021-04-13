import React, { Fragment } from 'react'
import { withFormik, Form, Field } from 'formik'

const UsualForm = ({ values }) => (
  <Form>
    {values.array.map((item, index) =>
      item.nestedArray.map((nestedItem, nestedIndex) => (
        <Fragment key={nestedItem.id}>
          <Field name={`array[${index}]nestedArray[${nestedIndex}].foo`} />
          <Field name={`array[${index}]nestedArray[${nestedIndex}].boo`} />
          <br />
        </Fragment>
      ))
    )}
    <button type='submit'>Submit</button>
  </Form>
)

// const UsualForm = ({ values }) => {
//   return (
//     <Form>
//       {values.array.map((item, index) => (
//         <ArrayItem item={item} key={item.id} name={`array[${index}]`} />
//       ))}
//       <button type='submit'>Submit</button>
//     </Form>
//   )
// }

// const ArrayItem = ({ item, name }) => {
//   return item.nestedArray.map((nestedItem, nestedIndex) => (
//     <NestedArrayItem key={nestedItem.id} name={`${name}.nestedArray[${nestedIndex}]`} />
//   ))
// }

// const NestedArrayItem = ({ name }) => {
//   return (
//     <>
//       <Field name={`${name}.foo`} />
//       <Field name={`${name}.boo`} />
//       <br />
//     </>
//   )
// }

export default withFormik({
  handleSubmit: values => console.log(values),
  mapPropsToValues: ({ data }) => data,
})(UsualForm)
