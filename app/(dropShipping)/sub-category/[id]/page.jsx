import SubCategoryProducts from '@/src/dropShipping/subCategoryProducts/subCategoryProducts';

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