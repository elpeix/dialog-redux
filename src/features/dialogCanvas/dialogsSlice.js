import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dialogs: [],
    position: {
        left: 20,
        top: 20
    }
};

export const dialogsSlice = createSlice({
    name: 'dialogs',
    initialState,
    reducers: {
        create: (state, action) => {
            if (dialogExists(state.dialogs, action.payload.id)) {
                toTop(state.dialogs, action.payload.id);
                return;
            }
            state.dialogs.forEach(dialog => dialog.config.focused = false);
            state.dialogs.push({
                id: action.payload.id,
                config: {
                    focused: true,
                    minimized: false,
                    width: action.payload.config.width,
                    height: action.payload.config.height,
                    parent: action.payload.config.parent,
                    left: state.position.left,
                    top: state.position.top,
                    zIndex: getMaxZIndex(state.dialogs) + 1,
                },
                children: action.payload.children
            });
            if (state.position.left > window.innerWidth - 130) { 
                state.position.left = initialState.position.left;
                state.position.top = initialState.position.top;
            } else {
                if (state.position.top > window.innerHeight - 180) {
                    state.position.top = initialState.position.top + 35;
                    state.position.left = initialState.position.left + 185;
                } else {
                    state.position.top += 50;
                    state.position.left += 50;
                }  
            }
        },
        close: (state, action) => {
            state.dialogs = state.dialogs.filter(dialog => dialog.id !== action.payload.id);
            toTopPrevious(state.dialogs);
        },
        closeAll: (state, action) => {
            state.dialogs = initialState.dialogs;
            state.position = initialState.position; 
        },
        toTop: (state, action) => {
            toTop(state.dialogs, action.payload.id);
        },
        toggleMinimize: (state, action) => {
            console.log('minimize');
            const dialog = getDialog(state.dialogs, action.payload.id);
            console.log(dialog.config.minimized ? true : false);
            if (!dialog) return;
            if (dialog.config.minimized) {
                toTop(state.dialogs, action.payload.id);
                return;
            }
            state.dialogs = state.dialogs.map(dialog => {
                if (dialog.id === action.payload.id) {
                    dialog.config.zIndex = 0;
                    dialog.config.minimized = true;
                    dialog.config.focused = false;
                }
                return dialog;
            });
            toTopPrevious(state.dialogs);
        }
    }
});

const dialogExists = (dialogs, id) => {
    return getDialog(dialogs, id) !== undefined;
}
const getDialog = (dialogs, id) => {
    return dialogs.find(dialog => dialog.id === id);
}

const getMaxZIndex = (dialogs) => {
    if (!dialogs || dialogs.length === 0) {
        return 0;
    }
    return Math.max.apply(Math, (dialogs.map(dialog => dialog.config.zIndex)));
};

const toTop = (dialogs, id) => {
    const maxZIndex = getMaxZIndex(dialogs);
    dialogs = dialogs.map(dialog => {
        if (dialog.id === id) {
            dialog.config.focused = true;
            dialog.config.minimized = false;
            if (dialog.config.zIndex !== maxZIndex) {
                dialog.config.zIndex = maxZIndex + 1;
            }
        } else {
            dialog.config.focused = false;
        }
        return dialog;
    });
}

const toTopPrevious = (dialogs) => {
    const maxZIndex = getMaxZIndex(dialogs);
    dialogs = dialogs.map(dialog => {
        if (!dialog.config.minimized && dialog.config.zIndex === maxZIndex) {
            dialog.config.focused = true;
        }
        return dialog;
    });
}

export const dialogActions = dialogsSlice.actions;

export const dialogsState = (state) => state.dialogs;

export default dialogsSlice.reducer;