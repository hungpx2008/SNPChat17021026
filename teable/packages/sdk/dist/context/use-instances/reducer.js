export function instanceReducer(state, action, factory) {
    switch (action.type) {
        case 'update': {
            return {
                ...state,
                instances: state.instances.map((instance) => {
                    if (instance.id === action.doc.id) {
                        return factory(action.doc.data, action.doc);
                    }
                    return instance;
                }),
            };
        }
        case 'ready':
            return {
                ...state,
                instances: action.results.map((r) => factory(r.data, r)),
                extra: action.extra,
            };
        case 'insert':
            return {
                ...state,
                instances: [
                    ...state.instances.slice(0, action.index),
                    ...action.docs.map((doc) => factory(doc.data, doc)),
                    ...state.instances.slice(action.index),
                ],
            };
        case 'remove':
            return {
                ...state,
                instances: [
                    ...state.instances.slice(0, action.index),
                    ...state.instances.slice(action.index + action.docs.length),
                ],
            };
        case 'move': {
            const { docs, from, to } = action;
            const newInstances = [...state.instances];
            const moveInstances = newInstances.splice(from, docs.length);
            newInstances.splice(to, 0, ...moveInstances);
            return {
                ...state,
                instances: newInstances,
            };
        }
        case 'clear': {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (state.instances[0] && state.instances[0].doc) {
                return {
                    ...state,
                    instances: [],
                    extra: undefined,
                };
            }
            return state;
        }
        case 'extra': {
            return {
                ...state,
                extra: action.extra,
            };
        }
        default:
            return state;
    }
}
