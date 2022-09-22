import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { dialogActions } from "../features/dialogCanvas/dialogsSlice";

const User = (props) => {
	const dispatch = useDispatch();

	const [user, setUser] = useState({
		name: props.name,
		level: props.level,
	});

	const openDialog = (e) => {
		e.stopPropagation();
		dispatch(
			dialogActions.create({
				id: "newDialog",
				config: {
					width: 300,
					height: 200,
				},
				children: (
					<div>
						<h4>I am a new dialog</h4>
					</div>
				),
			})
		);
	};

	const incLevel = (e) => {
		e.stopPropagation();
		setUser((user) => ({ ...user, level: user.level + 1 }));
	};

	return (
		<div className="user">
			<h3 onClick={incLevel}>{user.name}</h3>
			<h5>{user.level}</h5>
			<button onClick={openDialog}>Open dialog</button>
		</div>
	);
};

export default User;
