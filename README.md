# React FieldSet [![](https://img.shields.io/npm/v/react-fieldset.svg?style=flat)](https://www.npmjs.com/package/react-fieldset) ![](https://img.shields.io/bundlephobia/minzip/react-fieldset.svg?style=flat)

Sometimes, when using forms libraries like [Formik](http://github.com/jaredpalmer/formik) or [React Final Form](https://github.com/final-form/react-final-form), **naming and providing props for form components in large and deeply nested data may be quite tedious.** It's boring to write and difficult to maintain.

*For example, you will have to initialize as many variables for array indexes as the nesting levels of arrays. <br/>
Or the deeper an object is nested, the more unnecessary code is needed to name its fields. <br/>
Or if you need to provide the same props to several components, you need to put it in each of them.*

Well, it would be great to use a FieldSet component that will: 
  * **simulate data nesting and deal with field naming**
  * **provide context to child** components (Field, ErrorMessage, Custom Components, etc.)
  * **be optimized** and not strongly affect performance (check [performance notes](#performance))
  * make development of custom presentational components easier (for arrays or fields)
  * not be attached to specific form library, and can be used with different libraries
  
So, here for you: 
```javascript
import FieldSet, { withFieldSet, withFullName } from 'react-fieldset';
```

<br/>

### FieldSet
Container-component, that provide context and name-profix. Specified props:

Prop | Type | Description
-----|------|-----------
name | string | Will be prefixed to inner components props.name. It accumulates from whole context tree, so it also works fine for **deep nested objects or arrays.**
...props | any | All other props will be provided to inner component as they are, from parent FieldSet.

*Other specified props from version 2.x is deprecated for performance. For get "context", use props.contextName in child components*

<br/>

### withFieldSet (InnerComponent, [ provideContextName=false ]) 
HoC (higher order component) for make inner components connected with FieldSet and take all props. Allows for connected component to have props:

Prop | Type | Description
-----|------|-----------
contextName | string | Provide parent FieldSet full name into component, if it not specified and arg "provideContextName" of withFieldSet is true.

<br/>

### withFullName(InnerComponent)
HoC for make inner components connected with FieldSet and only prefixed name prop and ignore other context.

<br/>
  
# Examples
All examples written in Formik style, but it not really attached with it and **can be used with different libraries**.

### Form data layering 
It means to accumulate name-prefix for nested fields in a form data. For example: 
```jsx
import FieldSet, { withFieldSet } from 'react-fieldset';
Field = withFieldSet(Field);

//This one
<Field name="social.facebook" />
<Field name="social.twitter" />

//May looks like this
<FieldSet name="social">
  <Field name="facebook" />
  <Field name="twitter" />
</FieldSet>
```
It's also works fine with Arrays, Deep nested fields, ErrorMessage or your Custom component:
```jsx
import FieldSet, { withFieldSet, withFullName } from 'react-fieldset';
Field = withFieldSet(Field);
CustomFieldComponent = withFieldSet(CustomFieldComponent, true)
ErrorMessage=withFullName(ErrorMessage)

//Array
friends.map((friend, index) => (
<FieldSet key={index} name={`friends.${index}`}>
  <Field name="name"/>
  <Field name="age" component={CustomInputComponent}/>
  <CustomFieldComponent name="email"/>
</FieldSet>

//Deep nested
<FieldSet name='level1'>
  <Field name='nested-value'/>
  
  <FieldSet name='level2'>
    <Field name='deep-nested-value' 
      validate={ (value)=>(value===''?'Required!':false) }/>
    <ErrorMessage name='deep-nested-value'/>
  </FieldSet>
</FieldSet>
```
Of course, you need to connect all FieldSet inner components with **withFieldSet()**. You can find more information about this [below](#connection).

<br/>

### Providing props to the form components
All props (exept name) will be provided directly to inner component. Also, **feel free to use FieldSet without name-prefix** if needed. So, for example, FieldSet can set "required" for all Fields components in one line:
```jsx
import FieldSet, { withFieldSet } from 'react-fieldset';
Field = withFieldSet(Field);

//This one
<Field name="social.facebook" required={true}/>
<Field name="social.twitter" required={true}/>

//May looks like this
<FieldSet required={true}>
  <Field name="social.facebook"/>
  <Field name="social.twitter"/>
</FieldSet>

//Or like this
<FieldSet name="social" required={true}>
  <Field name="facebook"/>
  <Field name="twitter"/>
</FieldSet>

```
You can provide in props whatever you want, include functions or object, but check [performance notes](#performance) first.

<br/>

### Connection
If you want use FieldSet you need to connect all of inner components with **withFieldSet(Component)**.  
```javascript
import { withFieldSet } from 'react-fieldset';
CustomFieldComponent=withFieldSet(CustomFieldComponent, true);
```
##### Formik notes
If you use Field with component={CustomInputComponent} **you don't need to connect CustomInputComponent**, you need to connect Field. Formik Field, FastField or ErrorMessage is read-only, but I don't want use another name for it. Here, my solution:
```javascript
import { withFieldSet, withFullName } from 'react-fieldset';
import { Field as _Field } from 'formik';
import { FastField as _FastField } from 'formik';
import { ErrorMessage as _ErrorMessage } from 'formik';

export const Field=withFieldSet(_Field);
export const FastField=withFieldSet(_FastField);
export const ErrorMessage=withFullName(_ErrorMessage);
```

<br/>

# Performance
* FieldSet provides its context for all child components wrapped with withFieldSet, so **avoid passing inline-functions and objects to FieldSet props** if possible - this will cause each of connected child components to be re-rendered each time with Formik, which can affect performance. 
* **withFieldSet returns PureComponents,** so similarly avoid passing inline-functions and objects to props of wrapped components, if possible
* For components in which you don't need props from context and **only need to name prefixed use withFullName.** Its ignores context of the FieldSet, and only adds the name of the component, so this component will not be rerenders when you change the context.
* You can also **combine both of these HoCs** (withFieldSet, withFullName) to isolate one component from the context, and provide it to others within the same FieldSet
