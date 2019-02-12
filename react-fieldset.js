import React, { Component, PureComponent, createContext } from 'react';

const prefixeName=(contextProps, props)=>(props.name ? (contextProps&&contextProps.name?contextProps.name+'.':'')+props.name : contextProps.name);
const  { Provider, Consumer } = createContext();

export const withFieldSet = (InnerComponent, provideParentName=false)=>(
	class WithFieldSet extends PureComponent{
		render() {
			return <Consumer>
				{( contextProps )=>{
					let props = {...contextProps, ...this.props, name: prefixeName(contextProps, this.props)}
					if (provideParentName) {
						props.parentName=contextProps&&contextProps.name
					}
					return <InnerComponent {...props}/>
				}}
			</Consumer>
		}
	}
)

export const withFullName = (InnerComponent)=>( 
	class WithFullName extends PureComponent {
		render() {
			return <Consumer>
				{
					( contextProps )=>{
						return <InnerComponent {...this.props} name={ prefixeName(contextProps, this.props) }/>
					}
				}
			</Consumer>
		}
	}
)

let FieldSet = (props)=>{
	let {children, ...otheProps}=props;
	return <Provider value={ otheProps }>
		{ children }
	</Provider>
}
export default FieldSet=withFullName(FieldSet);