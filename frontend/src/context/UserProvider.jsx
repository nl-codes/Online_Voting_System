import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
    // Initialize with sessionStorage value or null
    const [userId, setUserId] = useState(() => {
        try {
            const storedUserId = sessionStorage.getItem("userId");
            return storedUserId ? storedUserId : null;
        } catch (error) {
            console.error("Error reading from sessionStorage:", error);
            return null;
        }
    });

    // Update sessionStorage when userId changes
    useEffect(() => {
        try {
            if (userId) {
                sessionStorage.setItem("userId", userId);
            } else {
                sessionStorage.removeItem("userId");
            }
        } catch (error) {
            console.error("Error writing to sessionStorage:", error);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
