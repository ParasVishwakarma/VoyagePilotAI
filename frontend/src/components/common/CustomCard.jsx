import { Card } from "@mui/material";

export default function CustomCard({ children }) {
    return (
        <Card
            elevation={0}
            sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #E5F3EC",
                boxShadow: "0 12px 40px rgba(0,0,0,.05)",
            }}
        >
            {children}
        </Card>
    );
}
