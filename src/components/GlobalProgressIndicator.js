import React from 'react';
import { useSelector } from 'react-redux';
import { AvoicesGlobalBar } from './progress';

const TOOL_MESSAGES = {
  transcribe: 'Transcribing…',
  translate: 'Translating…',
  synthesize: 'Synthesizing…',
  summarize: 'Summarizing…',
};

const GlobalProgressIndicator = () => {
  const { global, transcription, translation, synthesis, summarization } = useSelector(
    state => state.ui.loading
  );

  const isAnyLoading = global || transcription || translation || synthesis || summarization;

  let activeTool = 'global';
  if (transcription) activeTool = 'transcribe';
  if (translation) activeTool = 'translate';
  if (synthesis) activeTool = 'synthesize';
  if (summarization) activeTool = 'summarize';

  const message = TOOL_MESSAGES[activeTool] || 'Processing…';

  return <AvoicesGlobalBar visible={isAnyLoading} message={message} />;
};

export default GlobalProgressIndicator;
