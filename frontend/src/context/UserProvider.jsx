import React, { useState } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
