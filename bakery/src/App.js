import logo from './logo.svg';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom'
import Ingredients from './Components/Catalog/Ingredients';
import Equipment from './Components/Catalog/Equipment';
import {Layout} from './Components/Layout/Layout'
import { PageNoFound } from './Components/PageNoFound';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
  <>
    {/* <Ingredients /> */}
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='catalog/ingredients' element={<Ingredients />} />
        <Route path='catalog/equipment' element={<Equipment />} />
        <Route path='*' element={<PageNoFound />} />
      </Route>
    </Routes>
  </>
);
}

export default App;


{/* <div className="App">
<header className="App-header">
  <Ingredients />
</header>
</div> */}
