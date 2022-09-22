import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { dialogActions } from "./dialogsSlice";
import styles from "./Dialog.module.css";
import Draggable from 'react-draggable';

function Dialog(props) {
	const [dialog, setDialog] = useState({
		id: props.id,
		width: props.config.width || 400,
		height: props.config.height || 300,
		left: props.config.left || 100,
		top: props.config.top || 100,
	});

	const dragHandlers = {
		onStart: () => toTop(),
		onDrag: (el) => console.log(el)
	};

    const dispatch = useDispatch();

	const dialogRef = useRef(null);
	const dialogContent = useRef(null);

	const handleResize = (mouseDownEvent) => {
		const size = {
			width: dialog.width,
			height: dialog.height
		};
		const position = {
			x: mouseDownEvent.pageX,
			y: mouseDownEvent.pageY
		};
		const onMouseMove = (mouseMoveEvent) => {
			setDialog(ov => ({
				...ov,
				resizing: true,
				width: size.width - position.x + mouseMoveEvent.pageX,
				height: size.height - position.y + mouseMoveEvent.pageY
			}));
		};
		const onMouseUp = () => {
			document.body.removeEventListener("mousemove", onMouseMove);
			setDialog(ov => ({
				...ov,
				resizing: false
			}));
		}

		document.body.addEventListener("mousemove", onMouseMove);
		document.body.addEventListener("mouseup", onMouseUp, { once: true });
	};

	const toggleMaximize = (e) => {
		setDialog(ov => ({...ov, maximized: !dialog.maximized}));
		toTop();
	}

	const toggleMinimize = () => dispatch(dialogActions.toggleMinimize({id: props.id}));
	const toTop = () => dispatch(dialogActions.toTop({id: props.id}));
	const close = () => dispatch(dialogActions.close({id: props.id}));
	const bounds = {
		top: -props.config.top,
		left: -props.config.left,
		bottom: window.innerHeight - (80 + props.config.top),
		right: window.innerWidth - (30 + props.config.left) 
	};
	let dialogStyle = {
		display: props.config.minimized ? 'none' : '',
		zIndex: props.config.zIndex,
		position: 'absolute',
		top: dialog.top + "px",
		left: dialog.left + "px",
		height: dialog.height + "px",
		width: dialog.width + "px",
	}

	return (
		<Draggable handle="header.dialog-drag" cancel=".dialog-no-drag" disabled={dialog.maximized} bounds={bounds} defaultPosition={{ x: 0, y: 0 }} {...dragHandlers}>
		<div
			className={`${styles.dialog} ${dialog.maximized ? styles.maximized : ""}` + (props.config.focused ? " " + styles.focused : "") + (dialog.resizing ? " " + styles.resizing : "")}
			ref={dialogRef}
			style={dialogStyle}
			onClick={toTop}
		>
			<header className={`dialog-drag ${styles.header}`} onDoubleClick={toggleMaximize}>
				<div className={styles.header_icon}>&nbsp;</div>
				<div className={styles.header_title}>{props.id}</div>
				<div className={`dialog-no-drag ${styles.header_action} ${styles.header_close}`} onClick={close}>X</div>
				<div className={`dialog-no-drag ${styles.header_action} ${styles.header_maximize}`} onClick={toggleMaximize}>{dialog.maximized ? '-' : '^'}</div>
				<div className={`dialog-no-drag ${styles.header_action} ${styles.header_minimize}`} onClick={toggleMinimize}>_</div>
			</header>
			<div className={styles.content} ref={dialogContent}>
				{props.children}
			</div>
			<div className={styles.footer}>
				{!dialog.maximized && <div className={styles.resizer} onMouseDown={handleResize}></div>}
			</div>
		</div>
		</Draggable>
	);
}

export default Dialog;
