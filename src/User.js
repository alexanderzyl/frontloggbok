import React from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import GroupTable from "./GroupTable";
import {getAllUserPois} from "./utils/data_fetchers";

const User = () => {

    const items = [
        {
            key: 'points',
            label: 'All Points',
            children: <PoiTable getPois={getAllUserPois} />,
        },
        {
            key: 'groups',
            label: 'All Groups',
            children: <GroupTable />,
        },
    ];

    return <Tabs defaultActiveKey="points" items={items}/>;
};

export default User;