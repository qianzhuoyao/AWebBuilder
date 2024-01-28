import { Card, Image, CardFooter, Button } from "@nextui-org/react";

import { FC } from "react";

interface IW {
  src: string;
  name: string;
}

export const WidgetIconTemp: FC<IW> = ({ src, name }) => {
  return (
    <Card isFooterBlurred radius="lg" className="border-none p-1 bg-default-200">
      <Image
        alt={name}
        className="object-cover"
        height={200}
        isZoomed
        src={src}
        width={"100%"}
      />
      <CardFooter className="top-1 right-1 h-[20px] justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-md rounded-large bottom-1 w-[30px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">{name}</p>
      </CardFooter>
    </Card>
  );
};
