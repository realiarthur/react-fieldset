import React from 'react'
import ReactDOM from 'react-dom'
import FormWithEasyArray from './FormWithEasyArray'
import UsualForm from './UsualForm'
import data from './data'

const App = () => (
  <>
    <FormWithEasyArray data={data} />
    <UsualForm data={data} />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
