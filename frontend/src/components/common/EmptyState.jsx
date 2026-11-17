import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({ message }) {
    return (
        <Box
            sx={{
                py: 6,
                textAlign: "center",
            }}
        >
            <InboxIcon
                sx={{
                    fontSize: 70,
                    color: "#BDBDBD",
                }}
            />

            <Typography
                mt={2}
                color="text.secondary"
            >
                {message}
            </Typography>
        </Box>
    );
}
