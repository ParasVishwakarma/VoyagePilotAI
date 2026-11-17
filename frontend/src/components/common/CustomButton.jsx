import { Button } from "@mui/material";

export default function CustomButton({
                                         children,
                                         fullWidth = true,
                                         ...props
                                     }) {
    return (
        <Button
            variant="contained"
            disableElevation
            fullWidth={fullWidth}
            sx={{
                height: 56,
                borderRadius: "16px",
                background: "#2EAF7D",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 8px 24px rgba(46,175,125,.18)",

                "&:hover": {
                    background: "#249467",
                    transform: "translateY(-2px)",
                },
            }}
            {...props}
        >
            {children}
        </Button>
    );
}
