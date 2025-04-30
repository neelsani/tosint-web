import  { useState } from 'react';

interface BotInfo {
  first_name: string;
  username: string;
  id: number;
  can_read_all_group_messages?: boolean;
}

interface ChatInfo {
  title?: string;
  type: string;
  id: number;
  has_visible_history?: boolean;
  username?: string;
  invite_link?: string;
}

interface Administrator {
  user: {
    id: number;
    first_name: string;
    username?: string;
  };
}

export default function App() {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [memberStatus, setMemberStatus] = useState<string | null>(null);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [exportedLink, setExportedLink] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    setBotInfo(null);
    setMemberStatus(null);
    setChatInfo(null);
    setExportedLink(null);
    setCreatedLink(null);
    setMemberCount(null);
    setAdministrators([]);

    try {
      let tkn = token.trim();
      if (tkn.startsWith('bot')) tkn = tkn.slice(3);
      // getMe
      const meRes = await fetch(`https://api.telegram.org/bot${tkn}/getMe`);
      const meData = await meRes.json();
      if (!meData.ok) throw new Error(meData.description || 'Invalid token');
      setBotInfo(meData.result);

      // getChatMember
      const cmRes = await fetch(
        `https://api.telegram.org/bot${tkn}/getChatMember?chat_id=${chatId.trim()}&user_id=${meData.result.id}`
      );
      const cmData = await cmRes.json();
      if (cmData.ok && cmData.result) {
        setMemberStatus(cmData.result.status);
      } else if (cmData.description) {
        setMemberStatus(`Attention: ${cmData.description}`);
      }

      // getChat
      const chatRes = await fetch(
        `https://api.telegram.org/bot${tkn}/getChat?chat_id=${chatId.trim()}`
      );
      const chatData = await chatRes.json();
      if (!chatData.ok) throw new Error(chatData.description || 'Failed to get chat');
      setChatInfo(chatData.result);

      // exportChatInviteLink
      const expRes = await fetch(
        `https://api.telegram.org/bot${tkn}/exportChatInviteLink?chat_id=${chatId.trim()}`
      );
      const expData = await expRes.json();
      if (expData.ok) setExportedLink(expData.result);

      // createChatInviteLink
      const crtRes = await fetch(
        `https://api.telegram.org/bot${tkn}/createChatInviteLink?chat_id=${chatId.trim()}`
      );
      const crtData = await crtRes.json();
      if (crtData.ok && crtData.result.invite_link) {
        setCreatedLink(crtData.result.invite_link);
      }

      // getChatMemberCount
      const cntRes = await fetch(
        `https://api.telegram.org/bot${tkn}/getChatMemberCount?chat_id=${chatId.trim()}`
      );
      const cntData = await cntRes.json();
      if (cntData.ok) setMemberCount(cntData.result);

      // getChatAdministrators
      const admRes = await fetch(
        `https://api.telegram.org/bot${tkn}/getChatAdministrators?chat_id=${chatId.trim()}`
      );
      const admData = await admRes.json();
      if (admData.ok) setAdministrators(admData.result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Telegram OSINT Analyzer</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Telegram Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="-1001234567890"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>

        {botInfo && (
          <div className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold">Bot Info</h2>
            <p>First Name: {botInfo.first_name}</p>
            <p>Username: @{botInfo.username}</p>
            <p>User ID: {botInfo.id}</p>
            {botInfo.can_read_all_group_messages !== undefined && (
              <p>Can Read Group Messages: {botInfo.can_read_all_group_messages.toString()}</p>
            )}
          </div>
        )}

        {memberStatus && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Chat Member Status</h2>
            <p>{memberStatus}</p>
          </div>
        )}

        {chatInfo && (
          <div className="mt-4 space-y-2">
            <h2 className="text-xl font-semibold">Chat Info</h2>
            {chatInfo.title && <p>Title: {chatInfo.title}</p>}
            <p>Type: {chatInfo.type}</p>
            <p>ID: {chatInfo.id}</p>
            {chatInfo.has_visible_history !== undefined && (
              <p>Visible History: {chatInfo.has_visible_history.toString()}</p>
            )}
            {chatInfo.username && <p>Username: @{chatInfo.username}</p>}
            {chatInfo.invite_link && (
              <p>
                Invite Link:{' '}
                <a href={chatInfo.invite_link} className="text-blue-600 hover:underline">
                  {chatInfo.invite_link}
                </a>
              </p>
            )}
          </div>
        )}

        {(exportedLink || createdLink) && (
          <div className="mt-4 space-y-1">
            <h2 className="text-xl font-semibold">Invite Links</h2>
            {exportedLink && (
              <p>
                Exported:{' '}
                <a href={exportedLink} className="text-blue-600 hover:underline">
                  {exportedLink}
                </a>
              </p>
            )}
            {createdLink && (
              <p>
                Created:{' '}
                <a href={createdLink} className="text-blue-600 hover:underline">
                  {createdLink}
                </a>
              </p>
            )}
          </div>
        )}

        {memberCount !== null && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Member Count</h2>
            <p>{memberCount}</p>
          </div>
        )}

        {administrators.length > 0 && (
          <div className="mt-4 space-y-1">
            <h2 className="text-xl font-semibold">Administrators</h2>
            {administrators.map((admin) => (
              <div key={admin.user.id} className="pl-2">
                <p>
                  {admin.user.first_name}
                  {admin.user.username && ` (@${admin.user.username})`}
                  {' – '}ID: {admin.user.id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
