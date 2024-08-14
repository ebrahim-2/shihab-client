import type { IChatParticipant } from 'src/types/chat';
import { useState, useEffect, useCallback } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetConversation, useGetConversations } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';

import { Layout } from '../layout';
import { ChatNav } from '../chat-nav';
import { ChatRoom } from '../chat-room';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../hooks/use-collapse-nav';
import { ChatMessageItem } from '../chat-message-item';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const { user } = useAuthContext();

  // const { contacts } = useGetContacts();

  const searchParams = useSearchParams();

  const [conversationId, setConversationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  // const { conversations, conversationsLoading } = useGetConversations();
  const { data } = useGetConversation(conversationId);

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  useEffect(() => {
    setIsLoading(false);
  }, [data]);
  // const participants: IChatParticipant[] = conversation
  //   ? conversation.participants.filter(
  //       (participant: IChatParticipant) => participant.id !== `${user?.id}`
  //     )
  //   : [];

  // useEffect(() => {
  //   if (conversationError || !selectedConversationId) {
  //     // router.push(paths.dashboard.chat);
  //   }
  // }, [conversationError, router, selectedConversationId]);

  // const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
  //   setRecipients(selected);
  // }, []);
  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Chat
      </Typography>

      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          header: <></>,
          nav: <ChatNav selectedConversationId={conversationId} collapseNav={conversationsNav} />,
          main: (
            <>
              <ChatMessageList messages={data ?? []} isLoading={isLoading} />
              {data === undefined && (
                <EmptyContent
                  title="No messages until now!"
                  description="Write something awesome..."
                />
              )}
              <ChatMessageInput
                selectedConversationId={conversationId}
                setConversationId={setConversationId}
                setIsLoading={setIsLoading}
              />
            </>
          ),
          details: <></>,
        }}
      />
    </DashboardContent>
  );
}
