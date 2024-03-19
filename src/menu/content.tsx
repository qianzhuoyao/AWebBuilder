import {
  Card,
  Spacer,
  CardFooter,

  CardBody,

  Image,
} from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';


export const MenuContent = () => {
  const [list, setList] = useState<any>([]);
  useEffect(() => {
    window.addEventListener('message', e => {
      if (e.origin === window.location.protocol + '//' + window.location.hostname + ':30081') {
        setList(e.data);
      }
    }, false);
  }, []);

  return (
    <div className="flex flex-wrap content-start">
      {list?.map((item, index) => {
        return <Fragment key={index}>
          <Each data={item}></Each>
        </Fragment>;
      })}
    </div>
  );
};

const Each = ({ data }: any) => {
  return (
    <>
      <CustomCard data={data} />
      <Spacer x={4} />
      <Spacer y={4} />
    </>
  );
};

const CustomCard = ({ data }: any) => {
  return (
    <div>
      <Link to="/panel">
        <Card className="py-1.5 min-w-[300px] max-h-[320px] cursor-pointer">
          <CardBody className="overflow-visible py-2">
            <Image
              width={300}
              alt="NextUI hero Image"
              src={data.img}
            />
          </CardBody>
          <CardFooter className="justify-between">
            <div>
              <p className="text-tiny uppercase font-bold">{data.name}</p>
            </div>
            {/*<div className="flex-col items-end">*/}
            {/*  <p className="flex items-center mb-1">*/}
            {/*    <small className="text-default-500 mr-1">构建人:</small>*/}
            {/*    <small>admin</small>*/}
            {/*  </p>*/}
            {/*  <p className="flex items-center">*/}
            {/*    <small className="text-default-500">构建日期:</small>*/}
            {/*    <small>2024.01.01</small>*/}
            {/*  </p>*/}
            {/*</div>*/}
          </CardFooter>
        </Card>
        <Spacer x={4} />
        <Spacer y={4} />
      </Link>
    </div>
  );
};
