import type { IChatParticipant } from 'src/types/chat';
import { useRef, useMemo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { uuidv4 } from 'src/utils/uuidv4';
import { fSub, today } from 'src/utils/format-time';

import { createConversation, useSendMessageMutation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

type Props = {
  selectedConversationId: string;
  setConversationId: any;
  setIsLoading: any;
};

export function ChatMessageInput({
  selectedConversationId,
  setConversationId,
  setIsLoading,
}: Props) {
  const router = useRouter();

  const { user } = useMockedUser();
  const sendMessageMutation = useSendMessageMutation();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const messageData = () => {
    if (selectedConversationId) {
      return {
        messages_poll_id: selectedConversationId,
        message,
      };
    }

    return {
      message,
    };
  };

  // const conversationData = useMemo(
  //   () => ({
  //     id: uuidv4(),
  //     messages: [messageData],
  //     participants: [...recipients, myContact],
  //     type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
  //     unreadCount: 0,
  //   }),
  //   [messageData, myContact, recipients]
  // );

  // const handleAttach = useCallback(() => {
  //   if (fileRef.current) {
  //     fileRef.current.click();
  //   }
  // }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {
          if (message) {
            setMessage('');
            setIsLoading(true);
            await sendMessageMutation.mutate(messageData(), {
              onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ['messages'] });
                setConversationId(res.data[0]['messages_poll_id']);
              },
            });

            // if (selectedConversationId) {
            // } else {
            //   // const res = await createConversation(conversationData);
            //   // router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);
            //   // onAddRecipients([]);
            // }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [message, messageData, router, selectedConversationId]
  );

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        // startAdornment={
        //   <IconButton>
        //     <Iconify icon="eva:smiling-face-fill" />
        //   </IconButton>
        // }
        // endAdornment={
        //   <Stack direction="row" sx={{ flexShrink: 0 }}>
        //     <IconButton onClick={handleAttach}>
        //       <Iconify icon="solar:gallery-add-bold" />
        //     </IconButton>
        //     <IconButton onClick={handleAttach}>
        //       <Iconify icon="eva:attach-2-fill" />
        //     </IconButton>
        //     <IconButton>
        //       <Iconify icon="solar:microphone-bold" />
        //     </IconButton>
        //   </Stack>
        // }
        sx={{
          px: 3,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
