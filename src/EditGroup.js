import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './PublishGroup.css';
import SortedPois from "./SortedPois";
import {getOwnGroup} from "./utils/data_fetchers";
import EditMap from "./EditMap";
import {Button, Drawer} from "antd";

const PublishPoi = () => {
    const { shortId } = useParams();
    const [groupData, setGroupData] = useState({});
    const [curLocation, setCurLocation] = useState({});
    const [drawerVisible, setDrawerVisible] = useState(false);

    const fetchData = async (shortId) => {
        getOwnGroup(shortId).then(
            (res) => {
                setGroupData(res.data);
            }
        ).catch(
            (err) => {
                console.error('Failed to fetch group', err);
            }
        );
    };

    useEffect(() => {
        fetchData(shortId).then();
    }, [shortId]);

    const handleInvalidate = () => {
        fetchData(shortId).then();
    }

    function showDrawer() {
        setDrawerVisible(true);
    }

    let closeDrawer = () => {
        setDrawerVisible(false);
    }

    return (
        <div className='publish-group'>
            <Button type="primary" onClick={showDrawer}>Points</Button>
            <Drawer title="Points" placement="left"  onClose={closeDrawer} visible={drawerVisible}>
            <SortedPois npInfo={groupData} curLocation={curLocation} setCurLocation={setCurLocation} />
            </Drawer>
            <EditMap curLocation={curLocation} setCurLocation={setCurLocation}
                     groupData={groupData} invalidateParent={handleInvalidate}/>
        </div>

    );
};

export default PublishPoi;