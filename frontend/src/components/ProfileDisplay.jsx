import React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const ProfileDisplay = ({ image_url, sizes = { width: 60, height: 60 } }) => {
    return (
        <Stack direction="row" spacing={2}>
            <Avatar alt="Default Profile icon" src={image_url} sx={sizes} />
        </Stack>
    );
};

export default ProfileDisplay;
