import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
    // Initialize with localStorage value or null
    const [userId, setUserId] = useState(() => {
        try {
            const storedUserId = localStorage.getItem("userId");
            return storedUserId ? storedUserId : null;
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return null;
        }
    });

    // Update localStorage when userId changes
    useEffect(() => {
        try {
            if (userId) {
                localStorage.setItem("userId", userId);
            } else {
                localStorage.removeItem("userId");
            }
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
