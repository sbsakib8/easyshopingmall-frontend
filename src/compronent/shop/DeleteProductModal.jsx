"use client";

import { Delete as Trash2 } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";

const DeleteProductModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        zIndex: 1400,
      }}
    >
      <Box
        sx={{
          bgcolor: "transparent",
          maxWidth: "420px",
          width: "100%",
          outline: "none",
        }}
      >
        <div className="bg-bg/50 rounded-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-error/15 rounded-full">
              <Trash2 className="w-8 h-8 text-error" />
            </div>
            <Typography variant="h5" className="text-2xl font-bold text-error">
              Delete Product
            </Typography>
          </div>

          <Typography className="mb-6 text-slate-800">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>

          <div className="flex gap-3 mt-2">
            <Button
              onClick={onConfirm}
              fullWidth
              variant="contained"
              color="error"
              sx={{
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
              }}
            >
              Delete
            </Button>

            <Button
              onClick={onClose}
              fullWidth
              variant="outlined"
              sx={{
                py: 1.5,
                fontWeight: 600,
                color: "#475569",
                borderColor: "#cbd5e1",
                "&:hover": {
                  backgroundColor: "#e2e8f0",
                  borderColor: "#94a3b8",
                },
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteProductModal;
