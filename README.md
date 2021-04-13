# React Fieldset [![](https://img.shields.io/npm/v/react-fieldset.svg?style=flat)](https://www.npmjs.com/package/react-fieldset) ![](https://img.shields.io/bundlephobia/minzip/react-fieldset.svg?style=flat)

Declarative field naming and props providing in complex tree-data forms.

- [What & Why](#what-&-why)
- [Usage](#usage)
- [Examples](#examples)

<br/>

# What & Why

Naming and providing props to Form components may be quite tedious for large and deeply nested data. Also it's difficult to maintain, if your form changes frequently.

It would be great to use a `<Fieldset/>` component that will:

- Simulate data tree and deal with field naming
- Provide context to child components (Field, ErrorMessage, Custom Components, etc.)
- Make code easier
- Not be attached to specific form library, and can be used with different libraries

<br/>

## Make sure you need it!

Fieldset uses react contex and this can affect performance, so make sure your data and fields tree is really so complex that you need a `<Fieldset/>`. Anyway, try not to use it at first.

✅ &nbsp; You may need it if:

- You really need a declarative way to create complex forms with nested data
- You need to speed up development. For example, to build MVP
- The layout of your form is complex and the fields may not be direct children of the parent and you need to provide them with props

🚫 &nbsp; You don't need it if:

- Using render-prop pattern can solve your nesting
- You know that your form usually does not change. In this case, it is better to build it once without `<Fieldset/>`
- Your data and layout are as simple as the code block examples in this readme

⚡&nbsp; Also, since `<Fieldset/>` provides its context for all connected child components, so **avoid passing not memoized functions and objects to Fieldset props** whenever possible. `<Fieldset/>` using `React.memo` for memoize context, and this will cause each of connected child components to be re-rendered every time Form's context changes.

<br/>

# Usage

```jsx
import Fieldset, { withFieldset, useFieldset } from 'react-fieldset'
```
_All code sections are written in Formik style, but Fieldset isn't really attached with it and **can be used with different libraries**._

<br/>

### Form data layering

It means to accumulate name-prefix for nested fields in a form data. For example:

```jsx
//This code
<Field name="social.facebook" />
<Field name="social.twitter" />

//May look like this
<Fieldset name="social">
  <Field name="facebook" />
  <Field name="twitter" />
</Fieldset>
```

It also works fine to **Arrays and Deep nested fields:**

```jsx
//Array
friends.map((friend, index) => (
<Fieldset key={index} name={`friends.${index}`}>
  <Field name="name"/>
  <Field name="age"/>
</Fieldset>

//Deep nested
<Fieldset name='level1'>
  <Field name='nested-value'/>
  <Fieldset name='level2'>
    <Field name='deep-nested-value'/>
  </Fieldset>
</Fieldset>
```

It also works fine with **ErrorMessage, FastField, or any Custom Components** - just connect them `withFieldset()` or using `useFieldset`. You can find more information about this [below](#connection).

<br/>

### Providing props to the form components

All props (except name) will be provided directly to connected component. Also, **feel free to use Fieldset both with or without name prop**. So, for example, Fieldset can set "required" for all Fields components in one line:

```jsx
//This code
<Field name="facebook" required={true}/>
<Field name="twitter" required={true}/>

//May look like this
<Fieldset required={true}>
  <Field name="facebook"/>
  <Field name="twitter"/>
</Fieldset>

```

<br/>

# Examples

### Easy Array

This is a small illustration that shows how you can use Fieldset to create your own custom components like EasyArray, which can greatly simplify your code. Let's imagine that he needs to display this data structure:

```javascript
const data = {
  array: [
    {
      id: 'firstNestedArray',
      nestedArray: [
        { id: 1, foo: 1, boo: 2 },
        { id: 2, foo: 3, boo: 4 },
      ],
    },
    {
      id: 'secondNestedArray',
      nestedArray: [
        { id: 3, foo: 5, boo: 6 },
        { id: 4, foo: 7, boo: 8 },
      ],
    },
  ],
}
```

Commonly this can be done with:

```jsx
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
  </Form>
)
```

But with EasyArray its looks more simpler:

```jsx
const FormWithEasyArray = () => (
  <Form>
    <EasyArray name='array'>
      <EasyArray name='nestedArray'>
        <Field name='foo' />
        <Field name='boo' />
      </EasyArray>
    </EasyArray>
  </Form>
)
```

As working on EasyArray is also quite simple:

```jsx
import Fieldset, { withFieldset, useFieldset } from 'react-fieldset'

const EasyArray = ({ name, keyProp = 'id', children, ...props }) => {
  const { fullName, fieldsetProps } = useFieldset(name)
  const [{ value }] = useField(fullName)

  return value.map((item, index) => (
    <Fieldset {...fieldsetProps} {...props} key={item[keyProp]} name={`${name}[${index}]`}>
      {children}
    </Fieldset>
  ))
}

export default EasyArray

// Don't forget to connect your Fields
export const Field = withFieldset(_Field)
```

<br/>

### Connection

To use `<Fieldset/>` you need to connect all components witch need to receive context. If you use `<Field component={CustomInputComponent}>` you need to connect `<Field>`, not `<CustomInputComponent>`.

You can connect components using `withFieldset`:

```jsx
import { withFieldset } from 'react-fieldset'
export Field = withFieldset(_Field)
export ErrorMessage = withFieldset(_ErrorMessage)
```

Or, you can connect component using `useFieldset` hook:

```jsx
import { useFieldset } from 'react-fieldset'

export const Field = props => {
  const { fullName, fieldsetProps, contextName } = useFieldset(props.name)
  return <_Field {...fieldsetProps} {...props} name={fullName} />
}
```
