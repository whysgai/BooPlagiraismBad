export function createAssignment(name : string) {
    return {
        type: 'CREATE_ASSIGNMENT',
        name: name,
    }
};