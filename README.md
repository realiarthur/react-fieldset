[![](https://img.shields.io/npm/v/react-fieldset.svg?style=flat)](https://www.npmjs.com/package/react-fieldset)

# React FieldSet
Sometimes, when using forms libraries like [Formik](http://github.com/jaredpalmer/formik) or [React Final Form](https://github.com/final-form/react-final-form), it need to **provide same name-prefix, readOnly, context and other props** to the few form Fields (or ErrorMessage, Custom Component, etc.). So, here for you: 
```javascript
import FieldSet, { connectToFieldSet } from 'react-fieldset';
```
**FieldSet** - container-component, that provide context. Specified props:

Prop | Type | Description
-----|------|-----------
name | string | Will be prefixed to inner components props.name. It accumulates from whole context tree, so it also works fine for **deep nested objects or arrays.**
context | object | Will be provided to inner component. It **accumulates from whole context tree** and contain accumulated FieldSet "name" prop.
readOnly | boolean or function(context) | Will be executed if function, and provided to inner components. **Nested FieldSet have higher priority** to set this prop.
...props | any | All other props will be provided to connected component as they are, from whole context tree.

**connectToFieldSet()** - HoC for make inner components connected with FieldSet. Allows for connected component to have props: 

Prop | Type | Description
-----|------|-----------
readOnly | boolean or function(context) | You can set it in connected component (Field, for example), and it will be executed if function. **Have higher priority than FieldSet** to set this prop. More information in [example](https://github.com/realiarthur/react-fieldset#readonly)  
  
# Examples
All examples written in Formik style, but it not really attached with it and **can use with different libraries**.

## Form data layering 
It means to accumulate name-prefix for nested fields in a form data. For example: 
```jsx
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
    <Field 
      name='deep-nested-value' 
      validate={ (value)=>(value?false:'Required!') }
    />
    <ErrorMessage name='deep-nested-value'/>
  </FieldSet>
</FieldSet>
```
Of course, you need to connect all FieldSet inner components with **connectToFieldSet()**. You can find more information about this [below](https://github.com/realiarthur/react-fieldset#connection).

## Providing context and props to the form Fields
You can put whatever you want into the context prop of FieldSet, and find all this staff from whole context tree in **props.context** of your Custom component. All other props (exept name, readOnly and context) will provided directly to inner component. So, for example, FieldSet can share array item to all Fields components, and set required for all inputs in one line:
```jsx
friends.map((friend, index) => (
<FieldSet 
  key={index} 
  name={`friends.${index}`} 
  context={ {friend} } 
  required={true}>
  <Field name="name"/>
  <Field name="age" component={CustomInputComponent}/>
</FieldSet>

//So, now you have access to the friends array item here 
const CustomInputComponent = ( {context, ...props} )=>{
  console.log(context.friend.name);
  ...
}

```

## readOnly
Sometimes it need to set same readOnly prop for few Fields. So, feel free to **use FieldSet without name-prefix**:
```jsx
//This one
<Field name="facebook" readOnly={true} />
<Field name="twitter" readOnly={true} />

//May looks like this
<FieldSet readOnly={true}>
  <Field name="facebook" />
  <Field name="twitter" />
</FieldSet>
```
Sometimes it need to set readOnly in dependence of context, so **readOnly can be a function**, that takes context as param. **readOnly can be a function also in your Field component**, since you connect it with FieldSet:  
```jsx
friends.map((friend, index) => (
<FieldSet key={index} name={`friends.${index}`} context={ {friend} }>
  <Field name="name"/>
  <Field name="age"/>
  <Field name="drink" readOnly={ ( {friend} )=>(friend.age<21) }/>
</FieldSet>
```

## Connection
If you want use FieldSet you need to connect all of inner components with **connectToFieldSet(Component)**.  
```javascript
import { connectToFieldSet } from 'react-fieldset';
CustomFieldComponent=connectToFieldSet(CustomFieldComponent);
```
##### Formik annotation
If you use Field with component={CustomInputComponent} **you don't need to connect CustomInputComponent**, you need to connect Field. Formik Field, FastField or ErrorMessage is read-only, but I don't want use another name for it. Here, my solution:
```javascript
import { connectToFieldSet } from 'react-fieldset';
import { Field as _Field } from 'formik';
import { ErrorMessage as _ErrorMessage } from 'formik';
import { FastField as _FastField } from 'formik';

export const Field=connectToFieldSet(_Field);
export const ErrorMessage=connectToFieldSet(_ErrorMessage);
export const FastField=connectToFieldSet(_FastField);
```
