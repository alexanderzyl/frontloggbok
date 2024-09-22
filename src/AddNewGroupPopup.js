import React, {useState} from 'react';

const AddNewGroupPopup = ({lat, lng, createGroup}) => {
    const [name, setName] = useState('My Group');
    const [description, setDescription] = useState('automatically added');

    const handleButtonClick = () => {
        createGroup(name, description, lat, lng);
    };

    return (
        <div>
            <input type="text" value={name}
                   onChange={(e) => setName(e.target.value)} placeholder="Name"/>
            <input type="text" value={description}
                   onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>
            <button onClick={handleButtonClick}>Add Group</button>
        </div>
    );
};

export default AddNewGroupPopup;