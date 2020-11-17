import React from 'react'

function EnvVarTestComponent() {
    return (
        <div></div>
        // To access env variables, simply use 'process.env.<VARIABLE>'
        // React can only access variables with 'REACT_APP_' prefix
        //<p value="bang!">{process.env.REACT_APP_TESTVAR}</p>
    );
    
}
export default EnvVarTestComponent;