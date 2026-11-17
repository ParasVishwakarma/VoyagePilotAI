import { Button } from "@mui/material";

export default function SoftButton(props) {
    return (
        <Button
            disableElevation
            {...props}
            sx={{
                borderRadius: 4,
                px: 3,
                py: 1.2,
                fontWeight: 600,
                ...props.sx,
            }}
        />
    );
}
