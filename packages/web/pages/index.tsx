import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>Vízfő Kabin</title>
        <meta name="description" content="Meghitt pihenés a Bükkben" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <header className="w-full h-16 bg-white">
          <p className="text-white">header</p>
        </header>

        <main className="relative overflow-hidden">
          <div
            className="bg-cover bg-no-repeat bg-center h-screen"
            style={{
              backgroundImage: "url('hero.jpg')",
              filter: "blur(2px) grayscale(60%)",
              transform: "scale(1.1)",
            }}
          />
        </main>

        <footer className="w-full h-96 bg-black">
          <p>Footer</p>
        </footer>
      </div>
    </>
  )
}
