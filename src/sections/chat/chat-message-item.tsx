import type { IChatMessage, IChatParticipant } from 'src/types/chat';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';

import { useMessage } from './hooks/use-message';

// ----------------------------------------------------------------------

type Props = {
  message: any;
  // onOpenLightbox: (value: string) => void;
};

export function ChatMessageItem({ message }: Props) {
  const { user } = useAuthContext();

  // const { me, senderDetails, hasImage } = useMessage({
  //   message,
  //   currentUserId: `${user?.id}`,
  // });

  // const { firstName, avatarUrl } = senderDetails;

  // const renderInfo = (
  //   <Typography
  //     noWrap
  //     variant="caption"
  //     // sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
  //   >
  //     {/* {!me && `${firstName}, `} */}

  //     {fToNow(createdAt)}
  //   </Typography>
  // );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        // ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        // ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {/* {hasImage ? (
        <Box
          component="img"
          alt="attachment"
          src={body}
          // onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : ( */}
      {message.message}
      {/* )} */}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], { duration: theme.transitions.duration.shorter }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent={!message.assistant ? 'flex-end' : 'unset'}
      sx={{ mb: 1 }}
    >
      <Stack alignItems={!message.assistant ? 'flex-end' : 'flex-start'}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ position: 'relative', '&:hover': { '& .message-actions': { opacity: 1 } } }}
        >
          {renderBody}
        </Stack>
      </Stack>
    </Stack>
  );
}
