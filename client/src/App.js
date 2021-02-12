import { BrowserRouter as Router, Route} from "react-router-dom";

import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import './App.css';


import MenuBar from "./components/MenuBar"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
   <Router>
     <Container>
     <MenuBar />
     <Route exact path="/" component={Home} />
     <Route exact path="/login" component={Login} />
     <Route exact path="/signup" component={Signup} />
     </Container>
   </Router>
  );
}

export default App;
