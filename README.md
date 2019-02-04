# react-form-layer

Sometimes, when using forms libraries like [Formik](http://github.com/jaredpalmer/formik) or [React Final Form](https://github.com/final-form/react-final-form), it need to **provide same name-prefix and context** to the few form Fields (or ErrorMessage, Custom Component, etc.). So, here for you: 
* **FormLayer** - container-component, that provide context;
* **connectFormLayer()** - HoC for make inner components connected with FormLayer.

All examples written in Formik style, but it not really attached with it and **can use with different libraries**.
  
***
### Form data layering 
It means to accumulate name-prefix for nested fields in a form data. For example: 
```jsx
//This one
<Field name="social.facebook" />
<Field name="social.twitter" />

//May looks like this
<FormLayer name="social">
  <Field name="facebook" />
  <Field name="twitter" />
</FormLayer>
```
It's also works fine with Arrays, Deep nested fields, ErrorMessage or your Custom component:
```jsx
//Array
friends.map((friend, index) => (
<FormLayer key={index} name={`friends.${index}`}>
  <Field name="name"/>
  <Field name="age" component={CustomInputComponent}/>
  <CustomFieldComponent name="email"/>
</FormLayer>

//Deep nested
<FormLayer name='level1'>
  <Field name='nested-value'/>
  
  <FormLayer name='level2'>
    <Field name='deep-nested-value' validate={ (value)=>(value?false:'Required!') }/>
    <ErrorMessage name='deep-nested-value'/>
  </FormLayer>
</FormLayer>
```
Of course, you need to connect all FormLayers inner components with **connectFormLayer()**. You can find more information about this below.

***
### Providing context to the form Fields
You can put whatever you want into the props of FormLayer, and find it into **props.context (exept readOnly)** in your Custom component. For example, we can share array item to all Fields components:
```jsx
friends.map((friend, index) => (
<FormLayer key={index} name={`friends.${index}`} friend={friend}>
  <Field name="name"/>
  <Field name="age" component={CustomInputComponent}/>
</FormLayer>

const CustomInputComponent = ( {context, ...props} )=>{
  console.log(context.friend.name);
  ...
}

```
By the way, props will accumulate into props.context from **whole your context tree.**

***
### readOnly
Sometimes it need to set readOnly for few Fields. So, FormLayer provide it **directly to your Fields components** (not into context, like other props). Feel free to use FormLayer without name-prefix:
```jsx
//This one
<Field name="facebook" readOnly={true} />
<Field name="twitter" readOnly={true} />

//May looks like this
<FormLayer readOnly={true}>
  <Field name="facebook" />
  <Field name="twitter" />
</FormLayer>
```
Sometimes you want set readOnly in dependence of context, so **readOnly can be a function**, that takes context as param. **readOnly can be a function also in your Field component**, since you connect it with FormLayer:  
```jsx
friends.map((friend, index) => (
<FormLayer key={index} name={`friends.${index}`} friend={friend}>
  <Field name="name"/>
  <Field name="age"/>
  <Field name="drink" readOnly={ (context)=>(context.friend.age<21) }/>
</FormLayer>
```

***
### Connecting
If you want use FormLayer you need to connect all of inner components with **connectFormLayer(Component)**.  
```javascript
...
CustomFieldComponent=connectFormLayer(CustomFieldComponent)
```
##### Formik annotation
If you use Field with component={CustomInputComponent} **you don't need to connect CustomInputComponent**, you need to connect Field. Formik Field, FastField or ErrorMessage is read-only, but I don't want use another name for it. Here, my solution:
```javascript
import { Field as _Field } from 'formik';
const Field=connectFormLayer(_Field)
```
