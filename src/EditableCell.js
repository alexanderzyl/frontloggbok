// EditableCell.js
import React, { useState } from 'react';
import { Input } from 'antd';

const EditableCell = ({ value, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const toggleEdit = () => {
        setEditing(!editing);
        if (editing) {
            onChange(inputValue);
        }
    };

    return (
        editing ? (
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={toggleEdit}
                onPressEnter={toggleEdit}
                autoFocus
            />
        ) : (
            <div onClick={toggleEdit} style={{ paddingRight: 24 }}>
                {value}
            </div>
        )
    );
};

export default EditableCell;