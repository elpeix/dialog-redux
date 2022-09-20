import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { dialogActions } from "./dialogsSlice";
import styles from "./Dialog.module.css";

function Dialog(props) {
	const [dialog, setDialog] = useState({
		id: props.id,
		width: props.config.width || 400,
		height: props.config.height || 300,
		left: props.config.left || 100,
		top: props.config.top || 100,
	});

    const dispatch = useDispatch();

	const dialogRef = useRef(null);
	const dialogContent = useRef(null);

	const move = {
		onMouseDown: (e) => {
			toTop();
			if (e.button !== 0) return;
			setDialog((ov) => ({
				...ov,
				dragging: true,
				rel: {
					left: e.pageX - dialog.left,
					top: e.pageY - dialog.top,
				},
			}));
		},
		onMouseUp: () => endMove(),
		onMouseLeave: () => endMove(),
		onMouseMove: (e) => {
			if (!dialog.dragging) return;
			
			const top = (e.pageY - dialog.rel.top < 15) 
				? 0
				: Math.min(e.pageY - dialog.rel.top, window.innerHeight - 80);
			const left = Math.min(Math.max(0, e.pageX - dialog.rel.left), window.innerWidth - 50);

			if (dialog.maximized) {
				return;
			} 

			dialogRef.current.style.top = `${top}px`;
			dialogRef.current.style.left = `${left}px`;
		},
	};
	const endMove = () => {
		if (!dialog.dragging) return;
		setDialog((ov) => ({
			...ov,
			dragging: false,
			left: dialogRef.current.offsetLeft,
			top: dialogRef.current.offsetTop,
		}));
	};

	const resize = {
		onMouseDown: (e) => {
			toTop();
			if (e.button !== 0) return;
			setDialog((ov) => ({
				...ov,
				resizing: true,
				rel: {
					width: e.pageX - dialog.width,
					height: e.pageY - dialog.height,
				},
			}));
		},
		onMouseUp: (e) => endResize(e),
		onMouseLeave: (e) => endResize(e),
		onMouseMove: (e) => {
			if (!dialog.resizing) return;
			const width = e.pageX - dialog.rel.width;
			const height = e.pageY - dialog.rel.height;
			dialogContent.current.style.width = `${width}px`;
			dialogContent.current.style.height = `${height}px`;
		},
	};
	const endResize = (e) => {
		e.stopPropagation();
		if (!dialog.resizing) return;
		setDialog((ov) => ({
			...ov,
			resizing: false,
			maximized: false,
			height: dialogRef.current.clientHeight - 30,
			width: dialogRef.current.clientWidth,
		}));
	};

	const toggleMaximize = (e) => {
		e.stopPropagation();
		if (dialog.maximized) {
			setDialog((ov) => ({
				...ov,
				maximized: false,
				height: dialog.unmaximixed.height,
				width: dialog.unmaximixed.width,
				top: dialog.unmaximixed.top,
				left: dialog.unmaximixed.left
			}));
		} else {
			setDialog((ov) => ({
				...ov,
				maximized: true,
				height: window.innerHeight - 80,
				width: window.innerWidth,
				top: 0,
				left: 0,
				unmaximixed: {
					height: dialog.height,
					width: dialog.width,
					top: dialog.top,
					left: dialog.left
				}
			}));
		}
	}

	const toggleMinimize = () => dispatch(dialogActions.toggleMinimize({id: props.id}));
	const toTop = () => dispatch(dialogActions.toTop({id: props.id}));
	const close = () => dispatch(dialogActions.close({id: props.id}));

	return (
		<div
			className={styles.dialog + (props.config.focused ? " " + styles.focused : "") + (dialog.resizing ? " " + styles.resizing : "")}
			ref={dialogRef}
			style={{
				display: props.config.minimized ? 'none' : '',
				zIndex: props.config.zIndex,
				top: dialog.top + "px",
				left: dialog.left + "px",
			}}
			onMouseUp={toTop}
		>
			<div className={styles.header} {...move} onDoubleClick={toggleMaximize}>
				<div className={styles.header_icon}>&nbsp;</div>
				<div className={styles.header_title}>{props.id}</div>
				<div className={`${styles.header_action} ${styles.header_close}`} onClick={close}>X</div>
				<div className={`${styles.header_action} ${styles.header_maximize}`} onClick={toggleMaximize}>{dialog.maximized ? '-' : '^'}</div>
				<div className={`${styles.header_action} ${styles.header_minimize}`} onClick={toggleMinimize}>_</div>
			</div>
			<div
				className={styles.content}
				ref={dialogContent}
				style={{
					height: dialog.height + "px",
					width: dialog.width + "px",
				}}
			>
				{props.children}
			</div>
			<div className={styles.footer}>
				<div className={styles.resizer} {...resize}></div>
			</div>
		</div>
	);
}

export default Dialog;
