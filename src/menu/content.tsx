import {
  Card,
  Spacer,
  CardFooter,

  CardBody,

  Image,
} from "@nextui-org/react";
import { Link } from "react-router-dom";

export const MenuContent = () => {
  return (
    <div className="flex flex-wrap content-start">
      <Each></Each>
      <Each></Each>
      <Each></Each>
      <Each></Each>
      <Each></Each>
      <Each></Each>
    </div>
  );
};

const Each = () => {
  return (
    <>
      <CustomCard />
      <Spacer x={4} />
      <Spacer y={4} />
    </>
  );
};

const CustomCard = () => {
  return (
    <div>
      <Card className="py-1.5 min-w-[300px] max-h-[320px] cursor-pointer">
        <CardBody className="overflow-visible py-2">
          <Link to="/panel">
            <Image
              width={300}
              alt="NextUI hero Image"
              src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
            />
          </Link>
        </CardBody>
        <CardFooter className="justify-between">
          <div>
            <p className="text-tiny uppercase font-bold">可视化大屏</p>
          </div>
          <div className="flex-col items-end">
            <p className="flex items-center mb-1">
              <small className="text-default-500 mr-1">构建人:</small>
              <small>admin</small>
            </p>
            <p className="flex items-center">
              <small className="text-default-500">构建日期:</small>
              <small>2024.01.01</small>
            </p>
          </div>
        </CardFooter>
      </Card>
      <Spacer x={4} />
      <Spacer y={4} />
    </div>
  );
};
