import React, { useState, useContext, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatIcon from "@mui/icons-material/Chat";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GameInviting from "./GameInviting";
import { useHttpClient } from "../../hooks/useHttp";
import { AuthContext } from "../../context/auth-context";
import { onlineUsersSocket } from "../../utils/socketConnection";
import Snackbar from "../../components/Snackbar";
interface OnlineUserProps {
  username: string;
  onChat: () => void;
  openChat: string;
  messageFrom: string;
}

const OnlineUser: React.FC<OnlineUserProps> = ({
  username,
  onChat,
  openChat,
  messageFrom,
}) => {
  const { sendRequest } = useHttpClient();
  const [openGameInvitingModal, setOpenGameInvitingModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const auth = useContext(AuthContext);

  const openGameInviting = () => {
    sendGameInviting();
    setOpenGameInvitingModal(true);
  };

  const closeGameInviting = () => {
    setOpenGameInvitingModal(false);
    onlineUsersSocket.emit("invite-canceled", username);
  };

  useEffect(() => {
    onlineUsersSocket.on("decline-invite", (to) => {
      if (username == to) {
        setOpenGameInvitingModal(false);
        setOpenSnackbar(true);
      }
    });

    onlineUsersSocket.on("accept-invite", (to) => {
      if (username == to) {
        setOpenGameInvitingModal(false);
        window.open(
          `http://localhost:5174/game/${auth.username}&${username}?token=${auth.token}`
        );
      }
    });

    return () => {
      onlineUsersSocket.off("decline-invite");
      onlineUsersSocket.off("accept-invite");
    };
  }, []);

  useEffect(() => {
    if (openChat && messageFrom && openChat == messageFrom) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [openChat, messageFrom]);

  const sendGameInviting = async () => {
    try {
      await sendRequest(
        `http://localhost:3004/api/users/online/game-invite`,
        "POST",
        { from: auth.username, to: username }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <FiberManualRecordIcon sx={{ color: "green" }} />
        </ListItemIcon>
        <ListItemText sx={{ color: "black" }} primary={username} />
        <Badge color="error" variant="dot" invisible={!showNotification}>
          <IconButton
            edge="end"
            onClick={() => {
              onChat();
              setShowNotification(false);
            }}
            sx={{ padding: "2px 8px" }}
          >
            <ChatIcon sx={{ color: "black" }} />
          </IconButton>
        </Badge>
        <IconButton edge="end" onClick={openGameInviting}>
          <PlayArrowIcon sx={{ color: "black" }} />
        </IconButton>
      </ListItem>
      <GameInviting
        open={openGameInvitingModal}
        onClose={closeGameInviting}
        username={username}
      />
      <Snackbar
        snackbarOpen={openSnackbar}
        setSnackbarOpen={setOpenSnackbar}
        snackbarMessage={`Invite declined by ${username}`}
        severity="error"
      />
    </>
  );
};

export default OnlineUser;
