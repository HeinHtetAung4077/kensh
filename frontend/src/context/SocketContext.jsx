import { createContext, useEffect, useState, useContext } from "react";
// import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { useQuery } from "@tanstack/react-query";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
//   const { authUser } = useAuthContext();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      //socket.on() is used to listen to the events. Can be used both on client and server sides
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      })

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
