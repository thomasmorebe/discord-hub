import { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Server from "./components/Server";
import NotYet from "./components/NotYet";


class Hubs extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            loading: true,
            servers: [],
        }
    }

    componentDidMount() {
        this.getServers();
    }

    getServers() {
        fetch("https://camplus.club/api/servers")
            .then(res => res.json())
            .then(servers => {
                this.setState({
                    loading: false,
                    servers: servers,
                });
            });
    }


    render() {
        const { loading, servers } = this.state;

        if (loading) {
            return <div>Loading...</div>
        }

        return (
            <>
            <Row>
                <div className="container-fluid py-5">
                    <h1 class="display-5 fw-bold">Join us on Discord!</h1>
                    <p class="col-md-8 fs-4">We are team Camplus, bla bla bla... Dirk fix this!</p>
                </div>
            </Row>
            <Row>
                {servers.map(server => (
                    <Col xs={12} sm={6} md={4} key={server.id}>
                        <Server server={server} />
                    </Col>
                ))}
                <Col xs={12} sm={6} md={4}>
                        <NotYet />
                </Col>
            </Row>
            </>
        );
      }
}

export default Hubs;