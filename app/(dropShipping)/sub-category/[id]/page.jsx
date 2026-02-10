
import SubCategoryProducts from '@/src/dropShipping/subCategoryProducts/subCategoryProducts';
import React from 'react';

const subcategory = async(props) => {
      const params = await props.params;
  const { id } = params;
    return (
        <div>
            <SubCategoryProducts id={id}/>
        </div>
    );
};

export default subcategory;