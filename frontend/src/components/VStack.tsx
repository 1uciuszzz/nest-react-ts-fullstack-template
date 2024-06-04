import { PropsWithChildren } from "react";

const VStack = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col space-y-4">{children}</div>;
};

export default VStack;
