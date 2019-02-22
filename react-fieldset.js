import React, { Component, PureComponent, createContext } from 'react';

const prefixeName=(contextProps, props)=>(props.name ? (contextProps&&contextProps.name?contextProps.name+'.':'')+props.name : contextProps&&contextProps.name||'');
const  { Provider, Consumer } = createContext();

export const withFieldset = (InnerComponent, provideContextName=false)=>{
	return class WithFieldset extends PureComponent{
		render() {
			return <Consumer>
				{( contextProps )=>{
					let props = {...contextProps, ...this.props, name: prefixeName(contextProps, this.props)}
					if (provideContextName&&!props.contextName) {
						props.contextName=contextProps&&contextProps.name
					}
					return <InnerComponent {...props}/>
				}}
			</Consumer>
		}
	}
}

export const withFullName = (InnerComponent)=>{ 
	return class WithFullName extends PureComponent {
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
}

let Fieldset = (props)=>{
	let {children, ...otheProps}=props;
	return <Provider value={ otheProps }>
		{ children }
	</Provider>
}
export default Fieldset=withFullName(Fieldset);