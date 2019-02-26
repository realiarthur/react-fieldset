# React Fieldset [![](https://img.shields.io/npm/v/react-fieldset.svg?style=flat)](https://www.npmjs.com/package/react-fieldset) ![](https://img.shields.io/bundlephobia/minzip/react-fieldset.svg?style=flat)

Sometimes, when using forms libraries like [Formik](http://github.com/jaredpalmer/formik) or [React Final Form](https://github.com/final-form/react-final-form), **naming and providing props for form components in large and deeply nested data may be quite tedious.** It's boring to write and difficult to maintain.

> *For example, you will have to initialize as many variables for array indexes as the nesting levels of arrays. Or the deeper an object is nested, the more unnecessary code is needed to name its fields. Or if you need to provide the same props to several components, you need to put it in each of them.*

Well, it would be great to use a Fieldset component that will: 
  * **simulate data nesting and deal with field naming;**
  * **provide context to child** components (Field, ErrorMessage, Custom Components, etc.);
  * **be optimized** and not strongly affect performance (check [performance notes](#performance));
  * make development of custom presentational components easier (for arrays or fields);
  * not be attached to specific form library, and can be used with different libraries.
  
So, here for you: 
```javascript
import Fieldset, { withFieldset, withFullName } from 'react-fieldset';
```

### Fieldset
Container-component, that provide context and name-prefix. Specified props:

Prop | Type | Description
-----|------|-----------
name | string | Will be prefixed to inner components props.name. It accumulates from whole context tree, so it also works fine for **deep nested objects or arrays.**
...props | any | All other props will be provided to inner component as they are, from parent Fieldset.

*Other specified props from version 2.x is deprecated for performance. For get "context", use props.contextName in child components*

### withFieldset (InnerComponent, [ provideContextName=false ]) 
HoC (higher order component) for make inner components connected with Fieldset and take all props. Allows for connected component to have props:

Prop | Type | Description
-----|------|-----------
contextName | string | Provide parent Fieldset full name into component, if it not specified and arg "provideContextName" of withFieldset is true.

### withFullName(InnerComponent)
HoC for make inner components connected with Fieldset and only prefixed name prop and ignore other context.

<br/>
  
# Usage
All code sections written in Formik style, but it not really attached with it and **can be used with different libraries**.

### Form data layering 
It means to accumulate name-prefix for nested fields in a form data. For example: 
```jsx
import Fieldset, { withFieldset } from 'react-fieldset';
Field = withFieldset(Field);

//This one
<Field name="social.facebook" />
<Field name="social.twitter" />

//May looks like this
<Fieldset name="social">
  <Field name="facebook" />
  <Field name="twitter" />
</Fieldset>
```
It's also works fine to **Arrays and Deep nested fields:**
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
It also works fine with **ErrorMessage, FastField, or any Custom Components** - just connect them withFieldset() or withFullName(). You can find more information about this [below](#connection).

<br/>

### Providing props to the form components
All props (exept name) will be provided directly to inner component. Also, **feel free to use Fieldset both with or without name prop**. So, for example, Fieldset can set "required" for all Fields components in one line:
```jsx
//This one
<Field name="facebook" required={true}/>
<Field name="twitter" required={true}/>

//May looks like this
<Fieldset required={true}>
  <Field name="facebook"/>
  <Field name="twitter"/>
</Fieldset>

```
You can provide in props whatever you want, include functions or object, but check [performance notes](#performance) first.

<br/>

# Examples


### Easy Array
This is just a **small illustration** that shows why I needed the power of Fieldset and how you can use it to create Custom Components like EasyArray, which may greatly simplify your code. Suppose it need to display this data structure  
```javascript
initialValues={
  array: [
    {nestedArray: [
      {first: 1, second: 4}, 
      {first: 2, second: 3} 
    ]}, 
    {nestedArray: [ 
      {first: 3, second: 2}, 
      {first: 4, second: 1} 
    ]}
  ] 
}
```
**Commonly** this can be done with:
```jsx
const UsualForm=({values})=>(
  <Form>
    <FieldArray
      name="array"
      render={arrayHelpers => (
        values.array && values.array.length ? (
          values.array.map((item, index) => (
              <React.Fragment key={index}>
                {
                  item.nestedArray && item.nestedArray.length ? (
                    item.nestedArray.map((nestedItem, nestedIndex) => (
                      <React.Fragment key={nestedIndex}>
                        <Field name={`array[${index}]nestedArray[${nestedIndex}].first`}/>
                        <Field name={`array[${index}]nestedArray[${nestedIndex}].second`}/>   
                      </React.Fragment>
                    ))
                  ) : null
                }
              </React.Fragment>
            ))
        ) : null
      )
    }/>
  </Form>
)
```
But **with EasyArray** its looks much more simpler:
```jsx
const FormWithEasyArray=()=>(
  <Form>
    <EasyArray name='array' > 
      <EasyArray name='nestedArray'> 
        <Field name='first'/>
        <Field name='second'/>   
      </EasyArray>
    </EasyArray>
  </Form>
)
```
As the working on EasyArray also quite simple:
```jsx
Field=withFieldset(Field);
FieldArray=withFullName(FieldArray);

const EasyArray = ({name, children, ...props})=>(
  <FieldArray {...props} name={name} render= { (arrayHelpers)=>(
    getIn(arrayHelpers.form.values, arrayHelpers.name).map((item,index)=>(
      <Fieldset key={index} name={`${name||''}[${index}]`}>
        {children}
      </Fieldset>
    ))
  )}/>
)
```

<br/>


### Connection
If you want use Fieldset you need to connect all of inner components with **withFieldset**. If you need to get just a full name, for example in case with ErrorMessage, use **withFullName:**
```javascript
import { withFieldset, withFullName } from 'react-fieldset';
Field=withFieldset(Field)
ErrorMessage=withFullName(ErrorMessage);
CustomFieldComponent=withFieldset(CustomFieldComponent, true);
```

<details><summary><b>Formik notes</b></summary>
<p>
If you use Field with component={CustomInputComponent} <b>you don't need to connect CustomInputComponent</b>, you need to connect Field. Formik Field, FastField or ErrorMessage is read-only, but I don't want use another name for it. Here, my solution:

```javascript
import { withFieldset, withFullName } from 'react-fieldset';
import { Field as _Field } from 'formik';
import { FastField as _FastField } from 'formik';
import { ErrorMessage as _ErrorMessage } from 'formik';

export const Field=withFieldset(_Field);
export const FastField=withFieldset(_FastField);
export const ErrorMessage=withFullName(_ErrorMessage);
```
</p>
</details>

<br/>

# Performance
* Fieldset provides its context for all child components wrapped with withFieldset, so **avoid passing inline-functions and objects to Fieldset props** if possible - this will cause each of connected child components to be re-rendered each time with Formik, which can affect performance. 
* **withFieldset returns PureComponents,** so similarly avoid passing inline-functions and objects to props of wrapped components, if possible
* For components in which you don't need props from context and **only need to name prefixed use withFullName.** Its ignores context of the Fieldset, and only adds the name of the component, so this component will not be rerenders when you change the context.
* You can also **combine both of these HoCs** (withFieldset, withFullName) to isolate one component from the context, and provide it to others within the same Fieldset
