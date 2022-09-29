import React from 'react';
import Dialog from "./Dialog";

import styles from "./DialogCanvas.module.css";
import { useDispatch, useSelector } from "react-redux";
import { dialogActions, dialogsState } from "./dialogsSlice";
import Menu from '../../components/Menu';

const DialogCanvas = (props) => {
    const {dialogs} = useSelector(dialogsState);
    const dispatch = useDispatch();

    const createDialogSample = () => {
		const id = parseInt(Math.random() * 1000);
        dispatch(dialogActions.create({
            id: id,
            config: {
                width: 500, 
                height: 400
            },
            children: (
                <div>
                    <h2>The children - {id}</h2>
                </div>
            )
        }))
    }
    const toTop = (id) => dispatch(dialogActions.toTop({id: id}));
    const closeAll = () => dispatch(dialogActions.closeAll());

	return (
		<div className={styles.dialogCanvas}>
			<div className={styles.dialogs}>
				{dialogs.map((dialog) => (
					<Dialog
						key={"dialog" + dialog.id}
						id={dialog.id}
						config={dialog.config}
					>
						{dialog.children}
					</Dialog>
				))}
			</div>
			<div className={styles.dialogsFooter}>
                <Menu />
                <button onClick={createDialogSample}>Create Dialog</button>
				<button onClick={closeAll}>Close All</button>
				{dialogs.map((dialog) => (
					<div
						className={dialog.config.focused ? "focused" : ""}
						onClick={() => toTop(dialog.id)}
					>
						{dialog.id}
					</div>
				))}
			</div>
		</div>
	);
};

export default DialogCanvas;
