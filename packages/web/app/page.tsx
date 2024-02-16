import BookingWidget from "../components/bookingWidget"

export default function Home() {
  return (
    <div>
      <header className="w-full h-16 bg-white px-10 py-5">
        <p className="font-bold uppercase text-xl">Vízfő Cabin</p>
      </header>

      <main className="relative overflow-hidden">
        {/* TODO: change to next image */}
        <div
          className="bg-cover bg-no-repeat bg-center h-screen"
          style={{
            backgroundImage: "url('hero.jpg')",
            marginTop: "-4rem",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute inset-0 grid grid-rows-3">

            <div className="row-span-3 pl-10 flex flex-col pb-4">
              <div className="flex flex-col mt-auto">
              <h2 className="text-white text-5xl font-bold">
                Bükk is waiting for you with all of its beauty
              </h2>
              <h3 className="text-white text-2xl mt-4">
                Bring daydreams of long trails and chilling in jacuzzi to
                reality
              </h3>
              </div>
            </div>
            <div className="overflow-auto">
              <BookingWidget />
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
