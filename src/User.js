import React from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import GroupTable from "./GroupTable";

const { TabPane } = Tabs;

const User = () => {
    return (
        <Tabs defaultActiveKey="groups">
            <TabPane tab="My Groups" key="groups">
                <GroupTable></GroupTable>
            </TabPane>
            <TabPane tab="My Points" key="points">
                <PoiTable></PoiTable>
            </TabPane>
        </Tabs>
    );
};

export default User;