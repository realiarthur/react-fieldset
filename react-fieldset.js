import React, { Component } from 'react';

const FieldSetContext = React.createContext();

export const connectToFieldSet = (InnerComponent)=>(componentProps=>(
		<FieldSetContext.Consumer>
		{
			(contextProps)=>{
				let {name, context, readOnly, props} = contextProps||{name: '', context: {}, props: {}}

				//Accumulate Context
				context={ ...context, ...componentProps.context, name }
				
				//Data Layering
				name = componentProps.name ? (name?name+'.':'')+componentProps.name : name

				//Execute InnerComponent or FieldSet readOnly if needed and provide it to InnerComponent 
				readOnly = componentProps.readOnly!==undefined ? componentProps.readOnly : readOnly 
				readOnly = typeof(readOnly)==='function' ? readOnly(context) : readOnly;

				return <InnerComponent 
					{...props}
					{...componentProps}
					name={name}
					context={context}
					readOnly={readOnly}
				/>
			}
		}
		</FieldSetContext.Consumer>
	)
)

class FieldSet extends Component {
	render() {
		let { name, readOnly, context, children, ...props } = this.props;
		return <FieldSetContext.Provider value={ {name, readOnly, context, props} }>
			{children}
		</FieldSetContext.Provider>
	}
}

export default FieldSet=connectToFieldSet(FieldSet);