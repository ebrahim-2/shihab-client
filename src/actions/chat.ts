import type { IChatMessage, IChatParticipant, IChatConversation } from 'src/types/chat';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { keyBy } from 'src/utils/helper';
import axios, { fetcher, endpoints } from 'src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

const enableServer = false;

const MESSAGES_ENDPOINT = endpoints.chat;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

// export function useGetContacts() {
//   const url = [MESSAGES_ENDPOINT];

//   const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, fetcher, swrOptions);

//   const memoizedValue = useMemo(
//     () => ({
//       contacts: data?.contacts || [],
//       contactsLoading: isLoading,
//       contactsError: error,
//       contactsValidating: isValidating,
//       contactsEmpty: !isLoading && !data?.contacts.length,
//     }),
//     [data?.contacts, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

type ConversationsData = {
  conversations: IChatConversation[];
};

export function useGetConversations() {
  const url = [MESSAGES_ENDPOINT];

  const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(
    url,
    fetcher,
    swrOptions
  );

  // const memoizedValue = useMemo(() => {
  //   const byId = data?.conversations.length ? keyBy(data.conversations, 'id') : {};
  //   const allIds = Object.keys(byId);

  //   return {
  //     conversations: { byId, allIds },
  //     conversationsLoading: isLoading,
  //     conversationsError: error,
  //     conversationsValidating: isValidating,
  //     conversationsEmpty: !isLoading && !allIds.length,
  //   };
  // }, [data?.conversations, error, isLoading, isValidating]);

  return data;
}

// ----------------------------------------------------------------------

type ConversationData = {
  conversation: IChatConversation;
};

async function getMessages(conversationId: string) {
  const response = await axios.get(`${MESSAGES_ENDPOINT}/${conversationId}`);

  return response.data;
}

export function useGetConversation(conversationId: string) {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });
}

// ----------------------------------------------------------------------

const sendMessage = async (body: any) => {
  const response = await axios.post('create-message', body);

  return response;
};

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
  });
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const url = [MESSAGES_ENDPOINT, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(MESSAGES_ENDPOINT, data);

  /**
   * Work in local
   */
  // mutate(
  //   url,
  //   (currentData) => {
  //     const currentConversations: IChatConversation[] = currentData.conversations;

  //     const conversations: IChatConversation[] = [...currentConversations, conversationData];

  //     return { ...currentData, conversations };
  //   },
  //   false
  // );

  // return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(MESSAGES_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  }

  /**
   * Work in local
   */
  mutate(
    [MESSAGES_ENDPOINT, { params: { endpoint: 'conversations' } }],
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations = currentConversations.map((conversation: IChatConversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}
