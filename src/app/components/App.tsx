import { GroupChannel } from "@sendbird/chat/groupChannel";
import { Channel, ChannelList, sendbirdSelectors, useSendbirdStateContext } from "@sendbird/uikit-react";
import { useContext, useEffect, useState } from "react";
import ChannelHeader from "./ChannelHeader";
import Button from "@/shared/components/Button";
import CreateChannel from "@sendbird/uikit-react/CreateChannel";
import apiCall from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

export default function App() {
  const [channelUrl, setChannelUrl] = useState<string|null>(null);
  const globalStore = useSendbirdStateContext();
  const updateUserInfo = sendbirdSelectors.getUpdateUserInfo(globalStore);
  const { stores: { userStore: { user } } } = globalStore;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [nickname, setNickname] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!isEditModalOpen) {
      setNickname(user.nickname);
      setProfileUrl(user.profileUrl);
    }
  }, [isEditModalOpen])

  const selectChannel = (channel: GroupChannel | null) => {
    if (channel && channel.url !== channelUrl) {
      setChannelUrl(channel.url);
    }
  }

  const submitProfileEdit = async () => {
    await updateUserInfo(nickname ?? user.nickname, profileUrl);
    await apiCall("/users", "PUT", {
      id: user.userId,
      nickname: nickname ?? user.nickname,
      profileUrl: profileUrl
    }, token);
    setIsEditModalOpen(false);
  };

  const saveChannel = (channel: GroupChannel) => {
    const { url, creator, memberCount, members } = channel;
    apiCall("/channels", "POST", {
      channelUrl: url,
      createdBy: creator?.userId,
      chatmateId: memberCount === 1 ? members[0].userId : ''
    }, token);
  }

  return (
    <>
      <ChannelList
        onChannelSelect={selectChannel}
        // allowProfileEdit={true}
        // onProfileEditSuccess={}
        renderHeader={() => (
          <ChannelHeader
            user={user}
            onUserInfoClick={() => setIsEditModalOpen(true)}
            onAddChannelClick={() => setIsChannelModalOpen(true)}
          />
        )}
      />
      {channelUrl && <Channel channelUrl={channelUrl} />}

      {isChannelModalOpen && <CreateChannel
        onCreateChannel={saveChannel}
        onCancel={() => setIsChannelModalOpen(false)}
      />}

      {/* TODO: Make reusable modal component */}
      {isEditModalOpen && <div className="modal" onClick={() => setIsEditModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Edit User Profile</h2>
          <div className="modal-body">
            <label>
              Nickname: <input type="text" onChange={(e) => setNickname(e.target.value)} value={nickname} />
            </label>
            <label>
              Profile URL: <input type="text" onChange={(e) => setProfileUrl(e.target.value)} value={profileUrl} />
            </label>
          </div>
          <div className="modal-footer">
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <div style={{padding: 2}} />
            <Button onClick={submitProfileEdit} disabled={!(nickname || profileUrl)}>Save</Button>
          </div>
        </div>
      </div>}
    </>
  );
}
