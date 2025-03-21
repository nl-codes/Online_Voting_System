import React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import DefaultPic from "../assets/urahara_chibi.jpg";

const ProfileDisplay = () => {
    return (
        <Stack direction="row" spacing={2}>
            <Avatar
                alt="Default Profile icon"
                src={DefaultPic}
                sx={{ width: 60, height: 60 }}
            />
        </Stack>
    );
};

export default ProfileDisplay;
