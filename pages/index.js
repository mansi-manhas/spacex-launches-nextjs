import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export default function Home({launches}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <meta name="description" content="Latest launches from SpaceX" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SpaceX Launches
        </h1>

        <p className={styles.description}>
          Latest launches from SpaceX
        </p>

        <div className={styles.grid}>
            {launches.map(launch => {
              return (
                <a key={launch.id} href={launch.links.video_link} className={styles.card}>
            <h2>{launch.mission_name}</h2>
            <p><strong>Launch Date:</strong>{new Date(launch.launch_date_local).toLocaleDateString("en-US")}</p>
          </a>
              );
            })}


        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

/**
 * Before fetching any data with Apollo, we are going to setup our
 * page to be able to request data then pass the data as a prop to build
 * at the runtime.
 * 
 * When Next.js builds our app, it knows to look for this function >
 * Here, we'll return our props to the page
 * 
 * Since, it is asynchronous, we can make any request we like, 
 * and return the props to our app > thus, GraphQL
 */
export async function getStaticProps() {
  //creates a new apollo client, using the SpaceX API endpoint
  const apolloClient = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache()
  })
  const { data } = await apolloClient.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }`
  })
  return {
    props: {
      launches: data.launchesPast
    }
  }
}
