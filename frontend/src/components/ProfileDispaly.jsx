import React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import DefaultPic from "../assets/urahara_chibi.jpg";

const ProfileDispaly = () => {
    return (
        <Stack direction="row" spacing={2}>
            <Avatar alt="Remy Sharp" src={DefaultPic} />
        </Stack>
    );
};

export default ProfileDispaly;
