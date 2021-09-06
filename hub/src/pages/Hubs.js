import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Server from "./components/Server";
import NotYet from "./components/NotYet";
import { useTranslation } from 'react-i18next';


function Hubs() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getServers = () => {
        fetch("https://camplus.club/api/servers")
            .then(res => res.json())
            .then(servers => {
                setServers(servers);
                setLoading(false);
            });
    }

    useEffect(() => {
        getServers();
    }, []);


    const { t } = useTranslation()

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Row>
                <div className="container-fluid py-5">
                    <h1 class="display-5 fw-bold">{t('jumbotron_header')}</h1>
                    <p class="col-md-8 fs-4">{t('jumbotron_text')}</p>
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

export default Hubs;