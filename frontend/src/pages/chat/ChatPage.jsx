import React from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebarr from "../../components/sidebar/Sidebarr";

const ChatPage = () => {
  // const {username} = useParams();
  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen ">
      <div className="flex flex-col w-full h-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebarr />

        <MessageContainer />
      </div>
    </div>
  );
};

export default ChatPage;
