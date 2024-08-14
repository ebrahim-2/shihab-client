import type { IChatMessage, IChatParticipant } from 'src/types/chat';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from './hooks/use-messages-scroll';

// ----------------------------------------------------------------------

type Props = {
  messages: any[];
  isLoading: boolean;
};

export function ChatMessageList({ messages = [], isLoading }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  // const lightbox = useLightBox(slides);

  // if (loading) {
  //   return (
  //     <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
  //       <LinearProgress
  //         color="inherit"
  //         sx={{
  //           top: 0,
  //           left: 0,
  //           width: 1,
  //           height: 2,
  //           borderRadius: 0,
  //           position: 'absolute',
  //         }}
  //       />
  //     </Stack>
  //   );
  // }
  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
        {messages.map((message) => {
          return (
            <ChatMessageItem
              key={message.id}
              message={message}
              // onOpenLightbox={() => lightbox.onOpen(message.body)}
            />
          );
        })}
        {isLoading && (
          <ChatMessageItem
            key={'loading'}
            message={{
              message: 'يتم معالجة الطلب',
              id: 'loading',
              assistant: true,
            }}
          />
        )}
      </Scrollbar>

      {/* <Lightbox
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      /> */}
    </>
  );
}
