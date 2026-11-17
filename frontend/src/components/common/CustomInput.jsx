import { TextField } from "@mui/material";

export default function CustomInput(props) {
    return (
        <TextField
            fullWidth
            {...props}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",

                    "& fieldset": {
                        borderColor: "#DCEFE6",
                    },

                    "&:hover fieldset": {
                        borderColor: "#2EAF7D",
                    },

                    "&.Mui-focused fieldset": {
                        borderColor: "#2EAF7D",
                    },
                },
            }}
        />
    );
}
