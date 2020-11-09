import React from 'react'

function EnvVarTestComponent() {
    return (
        <p value="bang!">{process.env.REACT_APP_TESTVAR}</p>
    );
    
}
export default EnvVarTestComponent;