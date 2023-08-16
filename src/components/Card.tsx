import {
  Box,
  Heading,
  Text,
  Image,
  Skeleton,
  SkeletonText,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState } from 'react';

interface Comments {
  text: string;
}
interface Card {
  comments: Comments[];
  filename: string;
  _id: string;
}

interface CardProps {
  data: Card;
  viewImage: (url: string) => void;
  openAddComment: (_id: string) => void;
  openViewComment: (comments: Comments[]) => void;
}

export function Card({
  data,
  viewImage,
  openAddComment,
  openViewComment,
}: CardProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box key={data._id} borderRadius="md" bgColor="pGray.800">
      <Skeleton isLoaded={!isLoading}>
        <Image
          src={`${process.env.BASE_URL}images/${data.filename}`}
          alt={data.title}
          objectFit="cover"
          w="full"
          h={48}
          borderTopRadius="md"
          onClick={() => viewImage(data.filename)}
          onLoad={() => setIsLoading(false)}
          cursor="pointer"
          sizes="responsive"
        />
      </Skeleton>

      <Box pt={5} pb={4} px={6}>
        {isLoading ? (
          <>
            <SkeletonText fontSize="2xl" mt={2} noOfLines={1} />
            <SkeletonText fontSize="md" mt={7} noOfLines={1} />
          </>
        ) : (
          <SimpleGrid spacing={['3']}>
            <Button mt={['1', '0']} onClick={() => openAddComment(data?._id)}>
              Add Comment
            </Button>
            <Button
              mt={['2', '0']}
              onClick={() => openViewComment(data.comments)}
            >
              View Comment
            </Button>
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}
