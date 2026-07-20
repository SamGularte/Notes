import React from "react";
import { Blocks } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-72">
      <span>
        <Blocks
          height="70"
          width="70"
          color="#4fa94d"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
      </span>
      <span>Please wait...</span>
    </div>
  );
};

export default LoadingSpinner;
