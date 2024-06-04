import { PropsWithChildren } from "react";

const HStack = ({ children }: PropsWithChildren) => {
  return <div className="flex space-x-4">{children}</div>;
};

export default HStack;
