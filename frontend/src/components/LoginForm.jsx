import React, {useState} from "react"

function LoginForm() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const userNameRegEx = /^[A-Za-z0-9]+$/
    const passwordRegEx = /^[^\s*/$]+$/
    const handleUserName = (event) => {
        const user = event.target.value;
        if(!userNameRegEx.test(user))
        {
            event.target.
        }
        setUserName(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const onSubmit = (event) =>
    {

    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" value={userName} onChange={handleUserName} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={handlePassword} />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}