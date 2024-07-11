import Image from "next/image"

export default function Home() {
  return (
    <div>
      <header className="w-full h-16 bg-gray-950 px-10 flex items-center">
        <div>
          <Image src="/logo.svg" alt="Vízfő Kabin" width={60} height={60} />
        </div>
        {/* <p className="font-bold uppercase text-xl">Vízfő Kabin</p> */}
      </header>

      <main className="relative overflow-hidden">
        <div className="h-screen" style={{ marginTop: "-4rem" }}>
          <div className="absolute inset-0">
            <Image
              src="/hero.jpg"
              layout="fill"
              alt="hero"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute inset-0 grid grid-rows-3">
            <div className="row-span-3 px-10 flex flex-col pb-4">
              <div className="flex flex-col mt-auto mb-4 md:max-w-screen-md">
                <h2 className="text-white text-5xl font-bold">
                  Tarts egy kis szünetet, és lazíts egyet a{" "}
                  <span className="underline text-red-100">Bükkben</span>
                </h2>
                <h3 className="text-white text-2xl mt-4">
                  Kirándulj a környéken, vagy merülj el a jacuzziban miközben
                  élvezed a végtelen nyugalmat
                </h3>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full h-96 bg-black">
        <p>Footer</p>
      </footer>
    </div>
  )
}
