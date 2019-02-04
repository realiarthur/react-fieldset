![https://www.npmjs.com/package/react-fieldset](https://img.shields.io/npm/v/react-fieldset.svg?style=flat)

# React FieldSet
Sometimes, when using forms libraries like [Formik](http://github.com/jaredpalmer/formik) or [React Final Form](https://github.com/final-form/react-final-form), it need to **provide same name-prefix, readOnly and other context** to the few form Fields (or ErrorMessage, Custom Component, etc.). So, here for you: 
```javascript
import FieldSet, { connectToFieldSet } from 'react-fieldset'
```
**FieldSet** - container-component, that provide context. FieldSet props:

Prop | Type | Description
-----|------|-----------
name | string | Will be prefixed to inner components props.name. Also works fine for arrays or deep nested values
readOnly | boolean or function(context) | Will execute if function, and provide to inner components. Nested fields have higher priority to set it
...context | object | Any other props will be provide as props.context into inner component. Props will accumulate from whole your context tree.

**connectToFieldSet()** - HoC for make inner components connected with FieldSet. Allows for connected component to have props: 

Prop | Type | Description
-----|------|-----------
readOnly | boolean or function(context) | Will execute if function, and provide into connected component. More information in [example](https://github.com/realiarthur/react-fieldset#readonly)  
  
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
    <Field name='deep-nested-value' validate={ (value)=>(value?false:'Required!') }/>
    <ErrorMessage name='deep-nested-value'/>
  </FieldSet>
</FieldSet>
```
Of course, you need to connect all FieldSet inner components with **connectToFieldSet()**. You can find more information about this below.

## Providing context to the form Fields
You can put whatever you want into the props of FieldSet, and find it into **props.context (exept readOnly)** in your Custom component. For example, FieldSet can share array item to all Fields components:
```jsx
friends.map((friend, index) => (
<FieldSet key={index} name={`friends.${index}`} friend={friend}>
  <Field name="name"/>
  <Field name="age" component={CustomInputComponent}/>
</FieldSet>

const CustomInputComponent = ( {context, ...props} )=>{
  console.log(context.friend.name);
  ...
}

```

## readOnly
Sometimes it need to set same readOnly prop for few Fields. So, FieldSet provide it **directly to your Field components** (not into context, like other props). Feel free to use FieldSet without name-prefix:
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
Sometimes you want set readOnly in dependence of context, so **readOnly can be a function**, that takes context as param. **readOnly can be a function also in your Field component**, since you connect it with FieldSet:  
```jsx
friends.map((friend, index) => (
<FieldSet key={index} name={`friends.${index}`} friend={friend}>
  <Field name="name"/>
  <Field name="age"/>
  <Field name="drink" readOnly={ (context)=>(context.friend.age<21) }/>
</FieldSet>
```

## Connection
If you want use FieldSet you need to connect all of inner components with **connectToFieldSet(Component)**.  
```javascript
...
CustomFieldComponent=connectToFieldSet(CustomFieldComponent)
```
##### Formik annotation
If you use Field with component={CustomInputComponent} **you don't need to connect CustomInputComponent**, you need to connect Field. Formik Field, FastField or ErrorMessage is read-only, but I don't want use another name for it. Here, my solution:
```javascript
import { Field as _Field } from 'formik';
const Field=connectToFieldSet(_Field)
```
