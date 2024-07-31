import Image from "next/image"
import Link from "next/link"

import AirbnbButton from "@/components/airbnbButton"
import BookingButton from "@/components/bookingButton"

export default function Home() {
  return (
    <div className="bg-gray-950">
      <header className="w-full h-24 bg-gray-950 fixed z-50">
        <div className="max-w-screen-2xl mx-auto w-full flex items-center h-full">
          <div>
            <Image src="/logo.svg" alt="Vízfő Kabin" width={120} height={120} />
          </div>
        </div>
        {/* <p className="font-bold uppercase text-xl">Vízfő Kabin</p> */}
      </header>

      <main className="relative overflow-hidden">
        <div className="h-screen bg-gray-700">
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
            <div className="row-span-3 px-10 flex flex-col pb-16">
              <div className="flex flex-col mt-auto mb-4 md:max-w-screen-md">
                <h2 className="text-white text-3xl font-bold md:text-5xl">
                  Tarts egy kis szünetet, és lazíts egyet a{" "}
                  <span className="underline text-red-100">Bükkben</span>
                </h2>
                <h3 className="text-white text-xl mt-4 italic font-thin">
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

      <footer className="w-full md:h-96 bg-gray-800 py-8">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-3 text-white text-lg">
          <div className="text-center flex flex-col justify-center"></div>
          <div className="text-center flex flex-col justify-center">
            <p className="font-bold">Vízfő Kabin</p>
            <p>3425 Sály, Vízfő telep 662/5</p>
            <p className="font-bold mt-2">Csibi Mátyás</p>
            <Link href="mailto:info@vizfokabin.com">
              <p className="underline">info@vizfokabin.com</p>
            </Link>
          </div>
          <div>
            <Image src="/logo.svg" alt="Vízfő Kabin" width={400} height={400} />
          </div>
        </div>
      </footer>
    </div>
  )
}
