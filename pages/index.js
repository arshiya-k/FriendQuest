import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from "next-auth/react";
import { Heading, Stack, Button, Text } from '@chakra-ui/react';
import { useRouter } from "next/router";
import Header from '../components/navbar';



export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  let firstName;
  if (session) {
      const fullName = session.user.name.split(' ');
      firstName = fullName[0];
  }
  
  
  const getStarted = () => {
    router.push('/user/setup-profile');
  };

  const headtoDashboard = () => {
    router.push('/dashboard');
  };
  

  return (
    // <NavBar />
    <div className={styles.container}>
      <Head>
        <title>FriendQuest</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <Stack spacing={6}>
        <Heading as='h1' size='4xl' noOfLines={1}>
          FriendQuest
        </Heading>
        <Heading as='h2' size='2xl' noOfLines={2}>
          Heading out now? Lets make it more fun.
        </Heading>
      </Stack>
      {/* page to display if not signed in */}
      {!session && (
        <>
          <Button colorScheme='blue' onClick={() => signIn()}>
            Sign in
          </Button>
          {/* <button className={styles.primaryButton} onClick={() => signIn()}>
            Sign In
          </button> */}
        </>
      )}

      {/* page to display if signed in*/}
      {session && (
        <>
          <Text fontSize='lg'>If this is your first time, set up your account.</Text>
          <Button colorScheme='blue' onClick={() => getStarted()}>
            Get Started, {firstName}
          </Button>
          <Text fontSize='lg'>Returning?</Text>
          <Button colorScheme='blue' onClick={()=> headtoDashboard()}>
            Head to Dashboard 
          </Button>
          <Text fontSize='lg'>Done for the day?</Text>
          <Button colorScheme='blue' onClick={() => signOut()}>
            Sign Out
          </Button>
          
        </>
      )}
    </div>
  );
}
