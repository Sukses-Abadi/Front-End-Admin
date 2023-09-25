// import Image from "next/image";
// import { getCookie, setCookie} from "cookies-next";
import {cookies} from 'next/headers'

export default function Home() {
 
  const cookie = cookies().get("accessToken")
  console.log(cookie);

  return <main className=" bg-base-100 text-6xl">{cookie.value}!</main>;
}
