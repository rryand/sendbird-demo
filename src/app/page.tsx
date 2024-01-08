'use client';

import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import chance from "../utils/chance";

import "@sendbird/uikit-react/dist/index.css";
import App from "./components/App";
import { useRef } from "react";
import { AuthContext, AuthContextProvider } from "@/context/AuthContext";
import { Login } from "./components/Login";

export default function Home() {
  const userId = useRef(chance.guid());

  return (
    <main>
      <SendbirdProvider
        appId="8056AAA9-9594-4FE3-90AA-218173F46E42"
        userId={userId.current}//"a4197135-dfa4-5d8f-8c58-9b2ff486cdcd"
      >
        <AuthContextProvider>
          <AuthContext.Consumer>
            {({ isLoggedIn }) => <div className="app">
              {isLoggedIn ? <App/> : <Login />}
            </div>}
          </AuthContext.Consumer>
        </AuthContextProvider>
      </SendbirdProvider>
    </main>
  );
}
