import React from "react";

const DescriptoinContent = ({ description }) => {
  return (
    <div>
      <div
        className="prose prose-lg max-w-none 
        break-words overflow-hidden
             prose-h4:text-size-26 prose-h4:font-bold prose-h4:text-blackColor prose-h4:dark:text-blackColor-dark prose-h4:mb-15px prose-h4:!leading-14
             prose-p:text-lg prose-p:text-darkdeep4 prose-p:mb-5 prose-p:leading-30px"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default DescriptoinContent;
