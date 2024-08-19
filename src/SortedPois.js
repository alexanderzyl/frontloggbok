import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const SortedPois = ({ npInfo }) => {
    const [activeKey, setActiveKey] = useState("0"); // Set the first card to be opened initially

    return (
        <Accordion activeKey={activeKey}>
            {npInfo.pois.map((poi, index) => (
                <Card key={index}>
                    <Card.Header>
                        <Accordion.Header
                            as={Button}
                            variant="link"
                            eventKey={index.toString()}
                            onClick={() => setActiveKey(activeKey === index.toString() ? null : index.toString())}
                        >
                            {poi.name} {/* Display the name of the point of interest */}
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Item eventKey={index.toString()}>
                        <Accordion.Body>
                            {poi.description} {/* Display the details of the point of interest */}
                        </Accordion.Body>
                    </Accordion.Item>
                </Card>
            ))}
        </Accordion>
    );
};

export default SortedPois;