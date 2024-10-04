import React from 'react';
import {Collapse, Table} from "antd";
import { useMediaQuery } from 'react-responsive';

const { Panel } = Collapse;

const PoiTable = ({pois, poiEditRender}) => {

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <>
            {isMobile ? (
                // Render Collapse (Accordion) for mobile view
                <Collapse accordion>
                    {pois.map((poi) => (
                        <Panel header={poi.name} key={poi.shortId}>
                            {poiEditRender.renderPoi(poi)}
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                // Render Table for desktop view
                <Table
                    columns={poiEditRender.getColumns()}
                    rowClassName="editable-row"
                    dataSource={pois}
                    rowKey="shortId"
                    scroll={{ x: 768 }}
                />
            )}
        </>
    );
}

export default PoiTable;