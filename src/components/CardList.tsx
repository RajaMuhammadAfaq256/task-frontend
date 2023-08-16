import {
  SimpleGrid,
  useDisclosure,
  Image,
  Box,
  Stack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';
import { TextInput } from './Input/TextInput';
import { api } from '../services/api';

interface Comments {
  text: string;
}
interface Card {
  comments: Comments[];
  filename: string;
  _id: string;
}

interface CardsProps {
  cards: Card[];
  refetch: () => void;
}

export function CardList({ cards, refetch }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [imgUrl, setImgUrl] = useState('');
  const [id, setid] = useState<string>('');
  const [type, settype] = useState<string>('');
  const [allComments, setallComments] = useState<Comments[]>([]);
  const toast = useToast();
  function handleViewImg(url: string): void {
    setImgUrl(url);
    settype('viewImage');
    onOpen();
  }
  function handleAddComment(_id: string): void {
    setid(_id);
    settype('addComment');
    onOpen();
  }
  function handleAllComments(comments: Comments[]): void {
    setallComments(comments);
    settype('viewComment');
    onOpen();
  }
  const formValidations = {
    text: {
      required: 'Comment is required',
      maxLength: {
        value: 65,
        message: 'Max 65 required',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData: unknown) => {
      return api.post(`${process.env.BASE_URL}comment/${id}`, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const onSubmit = async ({ text }: { text: string }): Promise<void> => {
    try {
      await mutation.mutateAsync({ text });

      toast({
        title: 'Comment Added',
        description: 'Comment Added Successfully',
        status: 'success',
      });
    } catch {
      toast({
        title: 'Image Error',
        description: 'Something went wrong',
        status: 'error',
      });
    } finally {
      reset();
      onClose();
      refetch();
    }
  };
  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing={['10']}>
        {cards.map(card => (
          <Card
            // eslint-disable-next-line no-underscore-dangle
            key={card._id}
            data={card}
            viewImage={() => handleViewImg(card.filename)}
            openAddComment={(e: string) => handleAddComment(e)}
            openViewComment={(e: unknown) => handleAllComments(e)}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage
        imgUrl={imgUrl}
        isOpen={isOpen}
        onClose={onClose}
        showFooter={type === 'viewImage'}
      >
        {/* eslint-disable-next-line consistent-return, no-nested-ternary */}
        {type === 'viewImage' ? (
          <Image
            src={`${process.env.BASE_URL}images/${imgUrl}`}
            w="max"
            h="max"
            maxW={['225px', '450px', '900px']}
            maxH={['150px', '300px', '600px']}
            objectFit="cover"
            borderTopRadius="md"
          />
        ) : type === 'addComment' ? (
          <>
            <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <TextInput
                  placeholder="Add your Comment"
                  error={errors.text}
                  {...register('text', formValidations.text)}
                />
              </Stack>

              <Button
                my={6}
                isLoading={formState.isSubmitting}
                isDisabled={formState.isSubmitting}
                type="submit"
                w="100%"
                py={6}
              >
                save Comment
              </Button>
            </Box>
          </>
        ) : (
          <>
            {allComments?.map(({ text }: { text: string }) => {
              return (
                <Box
                  key={text}
                  borderRadius="md"
                  bgColor="pGray.800"
                  padding="4"
                >
                  <h1>{text}</h1>
                </Box>
              );
            })}
          </>
        )}
      </ModalViewImage>
    </>
  );
}
