import logo from './logo.svg';
import './App.css';
import Ingredients from './Components/Catalog/Ingredients';
import TopBar from './Components/Menu/TopBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
  <div className='container'>
    <TopBar />
    <Ingredients />
  </div>
);
}

export default App;


{/* <div className="App">
<header className="App-header">
  <Ingredients />
</header>
</div> */}
