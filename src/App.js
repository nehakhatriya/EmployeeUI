
import './App.css';
import Table from './Components/Table'
import Details from './Components/ViewDetails'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import Form from './Components/Form';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
     <Route path="/" exact component={Table}/>
     <Route path="/form/:id" exact component={Form}/>
     <Route path="/view/:id" exact component={Details}/>

    </div>
    </BrowserRouter>
  );
}

export default App;
