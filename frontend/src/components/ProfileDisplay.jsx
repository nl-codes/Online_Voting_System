import React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const ProfileDisplay = ({
    image_url,
    sizes = { width: 60, height: 60 },
    isSelected = false,
    className,
}) => {
    return (
        <Stack direction="row" spacing={2} className={`${className || ""}`}>
            <Avatar
                alt="Default Profile icon"
                src={image_url}
                sx={{
                    ...sizes,
                    border: isSelected ? "4px solid #c791d4" : "none",
                    boxShadow: isSelected ? "0 0 10px #c791d4" : "none",
                }}
            />
        </Stack>
    );
};

export default ProfileDisplay;
