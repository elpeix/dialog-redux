import React from 'react';
import { useDispatch } from "react-redux";
import { dialogActions } from "../features/dialogCanvas/dialogsSlice";
import User from './User';

const Menu = () => {
    const dispatch = useDispatch();
	const openUser = () => {
        dispatch(dialogActions.create({
            id: "user",
            config: {
                width: 400,
                height: 500
            },
            children: <User name="Bob" level={3} />
        }));
	};

	return (
		<>
			<button onClick={openUser}>Open user</button>
		</>
	);
};

export default Menu;
