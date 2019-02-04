import React, { Component } from 'react';

const FormLayerContext = React.createContext();

export const connectFormLayer = (InnerComponent)=>(props=>(
		<FormLayerContext.Consumer>
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
		</FormLayerContext.Consumer>
	)
)

class FormLayer extends Component {
	render() {
		let { name, children, context, ...newContext } = this.props;

		//accumulate context
		context={...context, ...newContext, name}

		return <FormLayerContext.Provider value={context}>
			{children}
		</FormLayerContext.Provider>
	}
}

export default FormLayer=connectFormLayer(FormLayer);