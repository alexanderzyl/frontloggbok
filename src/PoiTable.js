import React, {useEffect} from 'react';
import { Collapse, Table } from "antd";
import { useMediaQuery } from 'react-responsive';
import './PoiTable.css';

const { Panel } = Collapse;

const PoiTable = ({ pois, curPoiShortId, setCurPoiShortId, poiEditRender }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [activeKey, setActiveKey] = React.useState(null);

    // Function to determine row class name based on curPoiShortId
    const rowClassName = (record) => {
        return record.short_id === curPoiShortId ? 'selected-row' : 'editable-row';
    };

    const handleRowClick = (record) => {
        // console.log('Row clicked:', record.short_id);
        if (curPoiShortId !== record.short_id) {
            // console.log('Setting curPoiShortId:', record.short_id);
            setCurPoiShortId(record.short_id);
            setActiveKey(record.short_id);
        }
    };

    useEffect(() => {
        if(curPoiShortId && curPoiShortId !== activeKey) {
            setActiveKey(curPoiShortId);
        }
    }, [curPoiShortId]);

    const handleCollapseChange = (key) => {
        setActiveKey(key[0]);
        if (key) {
            setCurPoiShortId(key[0]);
        }
    };

    return (
        <>
            {isMobile ? (
                // Render Collapse (Accordion) for mobile view
                <Collapse accordion
                          activeKey={activeKey}
                          onChange={handleCollapseChange}
                          expandIconPosition="right"
                >
                    {pois.map((poi) => (
                        <Panel header={poi.name} key={poi.short_id}>
                            {poiEditRender.renderPoi(poi)}
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                // Render Table for desktop view
                <Table
                    columns={poiEditRender.getColumns()}
                    rowClassName={rowClassName}
                    dataSource={pois}
                    rowKey="short_id"
                    scroll={{ x: 768 }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => handleRowClick(record),
                        };
                    }}
                />
            )}
        </>
    );
};

export default PoiTable;