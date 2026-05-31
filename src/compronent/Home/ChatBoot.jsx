"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger, FaRobot } from "react-icons/fa";
import {
  Fab,
  Box,
  Grow,
  Paper,
  ClickAwayListener,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ChatBoot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const chatOptions = [
    {
      name: "Messenger",
      icon: <FaFacebookMessenger style={{ fontSize: "24px" }} />,
      color: "#0084ff",
      bgColor: "#e7f3ff",
      href: "https://m.me/easyshoppingmall8",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp style={{ fontSize: "24px" }} />,
      color: "#25D366",
      bgColor: "#e8f5e9",
      href: "https://wa.me/8801626420774",
    },
  ];

  const ActionButton = styled(Fab)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: "white",
    width: 56,
    height: 56,
    "&:hover": {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
      transform: "scale(1.05)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }));

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
      className="bottom-24! md:bottom-6!"
        sx={{
          position: "fixed",
          right: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {/* Expanded Options */}
        <Grow in={isOpen} timeout={300}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 2,
            }}
          >
            {chatOptions.map((option, index) => (
              <Grow
                key={option.name}
                in={isOpen}
                timeout={300 + index * 100}
                style={{ transformOrigin: "bottom right" }}
              >
                <Tooltip
                  title={option.name}
                  placement="left"
                  arrow
                  enterDelay={300}
                >
                  <a
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: option.bgColor,
                        color: option.color,
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.15) rotate(8deg)",
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      {option.icon}
                    </Paper>
                  </a>
                </Tooltip>
              </Grow>
            ))}
          </Box>
        </Grow>

        {/* Main Action Button */}
        <ActionButton
          onClick={handleToggle}
          sx={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isOpen ? theme.shadows[12] : theme.shadows[6],
          }}
          aria-label="chat options"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </ActionButton>
      </Box>
    </ClickAwayListener>
  );
};

export default ChatBoot;
