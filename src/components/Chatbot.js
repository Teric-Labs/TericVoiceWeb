import React, { useEffect } from 'react';

const AGENT_ID = '67d28c82-35d1-4eb1-870b-f86b546bf562';

export default function Chatbot() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      setTimeout(() => {
        if (window.initAIChatPlugin) {
          window.initAIChatPlugin({
            agentId: '${AGENT_ID}',
            targetLang: 'en',
            botName: 'AVOICE AI',
            containerId: 'ai-chat-root'
          });
        }
      }, 2000);
    `;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div
      id="ai-chat-root"
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
    />
  );
}
