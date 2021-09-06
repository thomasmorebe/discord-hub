import "./scss/App.scss";
import { Container } from "react-bootstrap";
import AppNav from "./Nav";
import Hubs from "./pages/Hubs";
import GlobalToast from "./pages/components/GlobalToast";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Container>
        <GlobalToast />
        <AppNav></AppNav>
        <Switch>
          <Route path="/">
            <Hubs />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
