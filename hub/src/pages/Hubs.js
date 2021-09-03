import { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Server from "./components/Server";


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
            <Row>
                {servers.map(server => (
                    <Col xs={12} sm={6} md={4} key={server.id}>
                        <Server server={server} />
                    </Col>
                ))}
            </Row>
        );
      }
}

export default Hubs;