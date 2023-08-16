import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const { data, isLoading, isError, refetch } = useInfiniteQuery('images', async () => {
    const response = await api.get(`${process.env.BASE_URL}images`);

    return response.data;
  });

  const formattedData = useMemo(() => {
    const flattedData = data?.pages[0]
    return flattedData;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>upFi</title>
        <meta name="description" content="Simple image host" />
      </Head>

      <Header />

      <Box maxW={1120} px={[10, 15, 20]} mx="auto" my={[10, 15, 20]}>
        <CardList cards={formattedData} refetch={refetch} />
      </Box>
    </>
  );
}
