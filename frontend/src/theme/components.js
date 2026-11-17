const components = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                background: "#F8FAFC",
                color: "#0F172A",
            },
        },
    },

    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 18,
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
                backgroundImage: "none",
            },
        },
    },

    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 18,
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
                border: "1px solid #E2E8F0",
                transition: "all .25s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.09)",
                },
            },
        },
    },

    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                padding: "8px 20px",
                fontWeight: 650,
                textTransform: "none",
                transition: "all .2s ease",
            },
            contained: {
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                "&:hover": {
                    backgroundColor: "#1D4ED8",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.35)",
                    transform: "translateY(-1px)",
                },
            },
        },
    },

    MuiTextField: {
        defaultProps: {
            variant: "outlined",
        },
    },

    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                "& fieldset": {
                    borderColor: "#E2E8F0",
                },
                "&:hover fieldset": {
                    borderColor: "#93C5FD",
                },
                "&.Mui-focused fieldset": {
                    borderWidth: "2px",
                    borderColor: "#2563EB",
                },
            },
        },
    },

    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                fontWeight: 650,
            },
        },
    },

    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 20,
                padding: 4,
            },
        },
    },

    MuiTableContainer: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                border: "1px solid #E2E8F0",
                boxShadow: "none",
            },
        },
    },

    MuiTableRow: {
        styleOverrides: {
            root: {
                transition: "background .15s ease",
                "&:hover": {
                    backgroundColor: "#F8FAFC",
                },
            },
        },
    },
};

export default components;
