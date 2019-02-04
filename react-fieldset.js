import React, { Component } from 'react';

const FieldSetContext = React.createContext();

export const connectFieldSet = (InnerComponent)=>(props=>(
		<FieldSetContext.Consumer>
		{
			(context)=>{
				let name=context&&context.name||''
				name = props.name ? (name?name+'.':'')+props.name : name

				let readOnly = props.readOnly || context&&context.readOnly 
				readOnly = typeof(readOnly)==='function' ? readOnly(context) : readOnly;

				return <InnerComponent 
					{...props} 
					context={context}
					readOnly={readOnly}
					name={name}
				/>
			}
		}
		</FieldSetContext.Consumer>
	)
)

class FieldSet extends Component {
	render() {
		let { name, children, context, ...newContext } = this.props;

		//accumulate context
		context={...context, ...newContext, name}

		return <FieldSetContext.Provider value={context}>
			{children}
		</FieldSetContext.Provider>
	}
}

export default FieldSet=connectFieldSet(FieldSet);
