import { BrowserRouter as Router, Route} from "react-router-dom";

import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import './App.css';
import { AuthProvider } from "./utils/context"
import AuthRoute from "./utils/AuthRoute";


import MenuBar from "./components/MenuBar"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Post from "./pages/Post"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/signup" component={Signup} />
          <Route exact path="/posts/:postId" component={Post} />
        </Container>
      </Router>
   </AuthProvider>
  );
}

export default App;
