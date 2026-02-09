
import SubCategoryProducts from '@/src/dropShipping/subCategoryProducts/subCategoryProducts';
import React from 'react';

const subcategory = async(props) => {
      const params = await props.params;
  const { id } = params;
  console.log(id)
    return (
        <div>
            <SubCategoryProducts id={id}/>
        </div>
    );
};

export default subcategory;