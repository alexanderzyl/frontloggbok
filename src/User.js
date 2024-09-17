import React from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import GroupTable from "./GroupTable";

const User = () => {
    const items = [
        {
            key: 'groups',
            label: 'My Groups',
            children: <GroupTable />,
        },
        {
            key: 'points',
            label: 'My Points',
            children: <PoiTable />,
        },
    ];

    return <Tabs defaultActiveKey="groups" items={items} />;
};

export default User;