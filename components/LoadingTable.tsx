import Image from "next/image";

export default function LoadingTable() {
  return ( 
      <div className="flex flex-col items-center justify-center h-96">
        <Image
          src="/espera.gif"
          width={100}
          height={100}
          alt="espera gif"
          className="rounded-3xl"
        />
      </div>
  );
}
