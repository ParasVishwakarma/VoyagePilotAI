import { Card } from "@mui/material";

export default function SoftCard({ children, sx = {}, ...props }) {
    return (
        <Card
            {...props}
            sx={{
                p: 3,
                borderRadius: 6,
                background: "#FCFDFE",
                border: "1px solid #EDF2F7",
                boxShadow:
                    "0 10px 30px rgba(15,23,42,.06)",
                transition: ".3s",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                        "0 20px 40px rgba(15,23,42,.10)",
                },

                ...sx,
            }}
        >
            {children}
        </Card>
    );
}
