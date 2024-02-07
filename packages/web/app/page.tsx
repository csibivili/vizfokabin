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
          <div className="absolute inset-0 grid grid-cols-4">

            <div className="col-span-3 pl-10 flex flex-col justify-end pb-16">
              <div className="flex flex-col">
              <h2 className="text-white text-7xl font-bold max-w-4xl">
                Bükk is waiting for you with all of its beauty
              </h2>
              <h3 className="text-white text-2xl max-w-4xl mt-4">
                Bring daydreams of long trails and chilling in jacuzzi to
                reality
              </h3>
              </div>
            </div>
            <div className="overflow-auto flex items-center">
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
