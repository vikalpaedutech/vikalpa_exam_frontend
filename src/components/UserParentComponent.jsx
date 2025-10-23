import React, {useState, useEffect} from 'react';
import UserSignUp from './UserSignup';
import UserPage from './UserPage';
import UserSignIn from './UserSignIn';


export default function UserParentComponent () {

    const [mobileSubmit, onMobileSubmit] = useState('');
    const [passwordSubmit, onPasswordSubmit] = useState('')

    console.log(mobileSubmit);
    console.log(passwordSubmit)

    return (
        <div>
            <UserSignIn onMobileSubmit={onMobileSubmit} onPasswordSubmit={onPasswordSubmit}/>
        </div>
    )
}
