import { Box } from "@mui/material";

export default function PageContainer({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#F6F8FC",
                px: 4,
                py: 3,
            }}
        >
            {children}
        </Box>
    );
}
