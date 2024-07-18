import Image from "next/image"

import AirbnbButton from "@/components/airbnbButton"
import BookingButton from "@/components/bookingButton"

export default function Home() {
  return (
    <div className="bg-gray-950">
      <header className="max-w-screen-2xl w-full h-16 bg-gray-950 px-10 flex items-center mx-auto">
        <div>
          <Image src="/logo.svg" alt="Vízfő Kabin" width={60} height={60} />
        </div>
        {/* <p className="font-bold uppercase text-xl">Vízfő Kabin</p> */}
      </header>

      <main className="relative overflow-hidden">
        <div className="h-screen bg-gray-700" style={{ marginTop: "-4rem" }}>
          <div className="absolute inset-0 max-w-screen-2xl justify-self-center">
            <div className="absolute inset-0 bg-black opacity-50" />
            <Image
              src="/hero.jpg"
              width={1920}
              height={1080}
              alt="hero"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 grid grid-rows-3 max-w-screen-2xl justify-self-center w-full">
            <div className="row-span-3 px-10 flex flex-col pb-4">
              <div className="flex flex-col mt-auto mb-4 md:max-w-screen-md">
                <h2 className="text-white text-5xl font-bold">
                  Tarts egy kis szünetet, és lazíts egyet a{" "}
                  <span className="underline text-red-100">Bükkben</span>
                </h2>
                <h3 className="text-white text-2xl mt-4 italic font-thin">
                  Kirándulj a környéken, vagy merülj el a jacuzziban miközben
                  élvezed a végtelen nyugalmat
                </h3>
                <div className="flex gap-4 mt-4 flex-col md:flex-row">
                  <AirbnbButton />
                  <BookingButton />
                </div>
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
