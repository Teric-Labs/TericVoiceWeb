// src/components/Chatbot.js

import React, { useEffect } from 'react';

const Chatbot = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.innerHTML = `
          setTimeout(() => {
            if (window.initAIChatPlugin) {
              window.initAIChatPlugin({
                agentId: '67d28c82-35d1-4eb1-870b-f86b546bf562',  // Get this from your Agents Dashboard
                targetLang: 'en',          // Use language code from the table above
                botName: 'AVOICE AI ',
                containerId: 'ai-chat-root'
              });
            }
          }, 3000);
        `;
        document.body.appendChild(script);
    
        // Clean up the script on component unmount
        return () => {
          document.body.removeChild(script);
        };
      }, []);

  return <div id="ai-chat-root" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}></div>;
};

export default Chatbot;
