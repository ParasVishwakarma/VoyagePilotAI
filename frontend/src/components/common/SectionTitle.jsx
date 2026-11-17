import { Typography } from "@mui/material";

export default function SectionTitle({
                                         title,
                                         subtitle,
                                     }) {
    return (
        <>
            <Typography
                variant="h5"
                fontWeight={700}
            >
                {title}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                {subtitle}
            </Typography>
        </>
    );
}
